<?php
/**
 * RAContractorController.php - Subcontractor RA Bills & Retention / AIT Accounting Controller
 * NirmanERP Bangladesh Edition
 */

namespace NirmanERP\Controllers;

use NirmanERP\Config\Database;
use NirmanERP\Middleware\AuthMiddleware;
use PDO;

class RAContractorController {

    /**
     * Create & Process Subcontractor RA Bill with Auto Retention, AIT, and GL Posting
     */
    public function createAndApproveRABill(): void {
        // Authenticate User
        $user = AuthMiddleware::authenticate();

        $input = json_decode(file_get_contents("php://input"), true);

        $projectId = (int) ($input['project_id'] ?? 0);
        $vendorId = (int) ($input['vendor_id'] ?? 0);
        $mbNumber = trim($input['mb_number'] ?? '');
        $workDescription = trim($input['work_description'] ?? '');
        $grossAmount = (float) ($input['gross_amount'] ?? 0.00);
        $retentionPct = (float) ($input['retention_rate_pct'] ?? 10.00); // Standard 10% Retention
        $aitPct = (float) ($input['ait_rate_pct'] ?? 5.00); // Standard 5% BD TDS/AIT
        $vatPct = (float) ($input['vat_rate_pct'] ?? 0.00);

        if (!$projectId || !$vendorId || empty($mbNumber) || $grossAmount <= 0) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Invalid parameters. Project, Vendor, MB Ref, and Positive Gross Amount are required."
            ]);
            return;
        }

        try {
            $result = Database::transaction(function(PDO $db) use ($projectId, $vendorId, $mbNumber, $workDescription, $grossAmount, $retentionPct, $aitPct, $vatPct, $user) {
                // 1. Calculate Tax & Retention Deductions
                $retentionAmount = round(($grossAmount * $retentionPct) / 100.0, 2);
                $aitAmount = round(($grossAmount * $aitPct) / 100.0, 2);
                $vatAmount = round(($grossAmount * $vatPct) / 100.0, 2);
                $netPayable = round($grossAmount - $retentionAmount - $aitAmount + $vatAmount, 2);

                $billNumber = "RA-BD-" . date('Ym') . "-" . rand(1000, 9999);

                // 2. Insert Subcontractor RA Bill
                $stmt = $db->prepare("
                    INSERT INTO subcontractor_ra_bills 
                    (bill_number, project_id, vendor_id, mb_number, bill_date, work_description, gross_amount, retention_rate_pct, retention_amount, ait_rate_pct, ait_amount, vat_rate_pct, vat_amount, net_payable, status, approved_at)
                    VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Approved', NOW())
                ");
                $stmt->execute([
                    $billNumber, $projectId, $vendorId, $mbNumber, $workDescription,
                    $grossAmount, $retentionPct, $retentionAmount, $aitPct, $aitAmount,
                    $vatPct, $vatAmount, $netPayable
                ]);

                $billId = $db->lastInsertId();

                // 3. Generate General Ledger Auto-Journal Header
                $journalNumber = "JV-RA-" . date('Ymd') . "-" . rand(100, 999);
                $narration = "Auto-Journal: RA Bill #{$billNumber} Approved. Subcontractor Work Ref MB #{$mbNumber}. Gross: BDT {$grossAmount}, Retention: BDT {$retentionAmount}, AIT: BDT {$aitAmount}";

                $stmtJn = $db->prepare("
                    INSERT INTO gl_journals (journal_number, journal_date, source_doc_type, source_doc_id, narration, total_debit, total_credit, posted_by)
                    VALUES (?, CURDATE(), 'RA_BILL', ?, ?, ?, ?, ?)
                ");
                $stmtJn->execute([$journalNumber, $billId, $narration, $grossAmount, $grossAmount, $user['username'] ?? 'System User']);
                $journalId = $db->lastInsertId();

                // 4. Fetch GL Account IDs (Cost Center / Liabilities)
                // Account 5100: Direct Civil Work Expense
                // Account 2150: Subcontractor Retention Payable
                // Account 2120: AIT / TDS Tax Payable (NBR)
                // Account 2100: Subcontractor Payable
                $accWorkExpense = self::getAccountByCode($db, '5100-CIVIL-WORK');
                $accRetentionPayable = self::getAccountByCode($db, '2150-RETENTION-MONEY');
                $accAitPayable = self::getAccountByCode($db, '2120-AIT-TAX-PAYABLE');
                $accVendorPayable = self::getAccountByCode($db, '2100-SUBCONTRACTOR-PAYABLE');

                // Journal Line 1: DEBIT Work Expense (Gross Amount)
                $stmtLine = $db->prepare("
                    INSERT INTO journal_entry_lines (journal_id, account_id, debit, credit, cost_center_project_id, remarks)
                    VALUES (?, ?, ?, 0.00, ?, ?)
                ");
                $stmtLine->execute([$journalId, $accWorkExpense, $grossAmount, $projectId, "Gross Work Done Ref MB #{$mbNumber}"]);

                // Journal Line 2: CREDIT Retention Money Payable
                $stmtLine->execute([$journalId, $accRetentionPayable, 0.00, $retentionAmount, $projectId, "10% Retention Deducted"]);

                // Journal Line 3: CREDIT AIT Tax Payable (TDS)
                $stmtLine->execute([$journalId, $accAitPayable, 0.00, $aitAmount, $projectId, "5% AIT Deducted at Source (BD IT Rule)"]);

                // Journal Line 4: CREDIT Subcontractor Payable (Net Payable)
                $stmtLine->execute([$journalId, $accVendorPayable, 0.00, $netPayable, $projectId, "Net Payable to Subcontractor"]);

                // Update Bill with auto_journal_id
                $db->prepare("UPDATE subcontractor_ra_bills SET auto_journal_id = ? WHERE id = ?")->execute([$journalId, $billId]);

                return [
                    "bill_id" => $billId,
                    "bill_number" => $billNumber,
                    "mb_number" => $mbNumber,
                    "gross_amount" => $grossAmount,
                    "retention_deductions" => $retentionAmount,
                    "ait_deductions" => $aitAmount,
                    "net_payable" => $netPayable,
                    "journal_number" => $journalNumber,
                    "status" => "Approved & Journal Posted"
                ];
            });

            echo json_encode([
                "success" => true,
                "data" => $result,
                "message" => "Subcontractor RA Bill created, Retention/AIT calculated, and Auto-Journal posted successfully."
            ]);

        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to process RA Bill: " . $e->getMessage()
            ]);
        }
    }

    private static function getAccountByCode(PDO $db, string $code): int {
        $stmt = $db->prepare("SELECT id FROM chart_of_accounts WHERE account_code = ?");
        $stmt->execute([$code]);
        $row = $stmt->fetch();
        return $row ? (int)$row['id'] : 1; // Fallback to 1
    }
}
