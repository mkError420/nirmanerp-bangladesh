<?php
/**
 * ProcurementController.php - Purchase Requisition, PO, GRN, and Site Store Stock Ledger Controller
 * NirmanERP Bangladesh Edition
 */

namespace NirmanERP\Controllers;

use NirmanERP\Config\Database;
use NirmanERP\Middleware\AuthMiddleware;
use PDO;

class ProcurementController {

    /**
     * Process Goods Receive Note (GRN) from Vendor Chalan -> Auto Stock Update & GL Posting
     */
    public function receiveGRNAndPostStock(): void {
        $user = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents("php://input"), true);

        $poId = (int) ($input['po_id'] ?? 0);
        $projectId = (int) ($input['project_id'] ?? 0);
        $chalanNo = trim($input['chalan_number'] ?? '');
        $vehicleNo = trim($input['vehicle_no'] ?? '');
        $storeKeeper = trim($input['site_store_keeper'] ?? 'Site Store In-Charge');
        $items = $input['items'] ?? []; // [{ item_code, item_name, unit, qty, unit_price_bdt }]

        if (!$poId || !$projectId || empty($chalanNo) || empty($items)) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Invalid GRN payload. PO ID, Project ID, Chalan Number, and Items array are required."
            ]);
            return;
        }

        try {
            $result = Database::transaction(function(PDO $db) use ($poId, $projectId, $chalanNo, $vehicleNo, $storeKeeper, $items, $user) {
                $grnNumber = "GRN-SITE-" . date('Ymd') . "-" . rand(1000, 9999);
                $totalGrnValue = 0.00;

                // 1. Create GRN Header
                $stmtGrn = $db->prepare("
                    INSERT INTO goods_received_notes (grn_number, po_id, project_id, received_date, chalan_number, vehicle_no, site_store_keeper, status)
                    VALUES (?, ?, ?, CURDATE(), ?, ?, ?, 'Stock Updated')
                ");
                $stmtGrn->execute([$grnNumber, $poId, $projectId, $chalanNo, $vehicleNo, $storeKeeper]);
                $grnId = $db->lastInsertId();

                // 2. Loop Items -> Add to GRN Items & Update Store Stock Ledger
                $stmtItem = $db->prepare("
                    INSERT INTO grn_items (grn_id, item_code, item_description, unit_of_measure, received_qty, accepted_qty, unit_price_bdt)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ");

                $stmtStockUpsert = $db->prepare("
                    INSERT INTO store_stock_ledger (project_id, item_code, item_name, unit, current_balance)
                    VALUES (?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE current_balance = current_balance + VALUES(current_balance)
                ");

                foreach ($items as $item) {
                    $itemCode = $item['item_code'];
                    $itemName = $item['item_name'];
                    $unit = $item['unit'];
                    $qty = (float) $item['qty'];
                    $unitPrice = (float) $item['unit_price_bdt'];
                    $itemTotal = round($qty * $unitPrice, 2);
                    $totalGrnValue += $itemTotal;

                    $stmtItem->execute([$grnId, $itemCode, $itemName, $unit, $qty, $qty, $unitPrice]);
                    $stmtStockUpsert->execute([$projectId, $itemCode, $itemName, $unit, $qty]);
                }

                // 3. Post Inventory General Ledger Entry
                $journalNumber = "JV-GRN-" . date('Ymd') . "-" . rand(100, 999);
                $narration = "Auto-Journal: Inventory Received GRN #{$grnNumber} against Chalan #{$chalanNo}. Total Valuation: BDT {$totalGrnValue}";

                $stmtJn = $db->prepare("
                    INSERT INTO gl_journals (journal_number, journal_date, source_doc_type, source_doc_id, narration, total_debit, total_credit, posted_by)
                    VALUES (?, CURDATE(), 'GRN', ?, ?, ?, ?, ?)
                ");
                $stmtJn->execute([$journalNumber, $grnId, $narration, $totalGrnValue, $totalGrnValue, $user['username'] ?? 'Store In-Charge']);
                $journalId = $db->lastInsertId();

                // DEBIT Inventory Raw Material Asset / CREDIT Vendor Payable
                $accInventory = 1; // 1050-STORE-INVENTORY
                $accVendorPayable = 2; // 2010-VENDOR-ACCOUNTS-PAYABLE

                $stmtLine = $db->prepare("
                    INSERT INTO journal_entry_lines (journal_id, account_id, debit, credit, cost_center_project_id, remarks)
                    VALUES (?, ?, ?, ?, ?, ?)
                ");
                $stmtLine->execute([$journalId, $accInventory, $totalGrnValue, 0.00, $projectId, "Site Store Material Stock In"]);
                $stmtLine->execute([$journalId, $accVendorPayable, 0.00, $totalGrnValue, $projectId, "Vendor Liability for GRN Ref #{$chalanNo}"]);

                $db->prepare("UPDATE goods_received_notes SET auto_journal_id = ? WHERE id = ?")->execute([$journalId, $grnId]);

                return [
                    "grn_id" => $grnId,
                    "grn_number" => $grnNumber,
                    "chalan_number" => $chalanNo,
                    "total_value_bdt" => $totalGrnValue,
                    "journal_number" => $journalNumber,
                    "stock_status" => "Site Store Ledger Updated & GL Posted"
                ];
            });

            echo json_encode([
                "success" => true,
                "data" => $result,
                "message" => "GRN processed, site store inventory increased, and GL inventory journal posted."
            ]);

        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to process GRN: " . $e->getMessage()
            ]);
        }
    }
}
