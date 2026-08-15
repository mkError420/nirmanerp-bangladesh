<?php
/**
 * TaxAitController.php - Bangladesh AIT (TDS) Withholding & PDC Lifecycle Manager
 * NirmanERP Bangladesh Edition
 */

namespace NirmanERP\Controllers;

use NirmanERP\Config\Database;
use NirmanERP\Middleware\AuthMiddleware;
use PDO;

class TaxAitController {

    /**
     * Update Post-Dated Cheque (PDC) Status (Issued -> Deposited -> Cleared/Bounced)
     */
    public function updatePdcStatus(): void {
        AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents("php://input"), true);

        $pdcId = (int) ($input['pdc_id'] ?? 0);
        $newStatus = trim($input['status'] ?? ''); // Deposited, Cleared, Bounced
        $bounceReason = trim($input['bounce_reason'] ?? '');

        if (!$pdcId || !in_array($newStatus, ['Issued', 'Deposited', 'Cleared', 'Bounced'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Invalid status. Allowed values: Issued, Deposited, Cleared, Bounced."
            ]);
            return;
        }

        try {
            $result = Database::transaction(function(PDO $db) use ($pdcId, $newStatus, $bounceReason) {
                $stmt = $db->prepare("SELECT * FROM pdc_cheques WHERE id = ?");
                $stmt->execute([$pdcId]);
                $pdc = $stmt->fetch();

                if (!$pdc) {
                    throw new \Exception("PDC Cheque record not found.");
                }

                $clearanceDate = ($newStatus === 'Cleared') ? date('Y-m-d') : null;

                $updateStmt = $db->prepare("
                    UPDATE pdc_cheques 
                    SET status = ?, clearance_date = ?, bounce_reason = ? 
                    WHERE id = ?
                ");
                $updateStmt->execute([$newStatus, $clearanceDate, $bounceReason, $pdcId]);

                return [
                    "pdc_id" => $pdcId,
                    "cheque_number" => $pdc['cheque_number'],
                    "bank_name" => $pdc['bank_name'],
                    "amount_bdt" => $pdc['amount_bdt'],
                    "previous_status" => $pdc['status'],
                    "new_status" => $newStatus,
                    "clearance_date" => $clearanceDate
                ];
            });

            echo json_encode([
                "success" => true,
                "data" => $result,
                "message" => "PDC Cheque status updated to {$newStatus} successfully."
            ]);

        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to update PDC status: " . $e->getMessage()
            ]);
        }
    }

    /**
     * Calculate Bangladesh AIT Withholding Rate under NBR Income Tax Rules
     */
    public static function calculateAitWithholding(float $baseAmount, string $vendorType, bool $hasTin): array {
        // NBR BD IT Rules Tax Rates
        // Material Supplier: 3% if TIN, 5% if No TIN
        // Subcontractor Civil: 5% if TIN, 7.5% if No TIN
        // Equipment Hire: 5%
        // Service Provider / Consultant: 10%
        $ratePct = 5.0; // default

        switch ($vendorType) {
            case 'Material Supplier':
                $ratePct = $hasTin ? 3.0 : 5.0;
                break;
            case 'Subcontractor':
                $ratePct = $hasTin ? 5.0 : 7.5;
                break;
            case 'Equipment Vendor':
                $ratePct = $hasTin ? 5.0 : 7.0;
                break;
            case 'Service Provider':
                $ratePct = $hasTin ? 10.0 : 15.0;
                break;
        }

        $aitDeductionBDT = round(($baseAmount * $ratePct) / 100.0, 2);
        $netPayableBDT = round($baseAmount - $aitDeductionBDT, 2);

        return [
            "gross_amount_bdt" => $baseAmount,
            "vendor_type" => $vendorType,
            "has_tin" => $hasTin,
            "applicable_ait_rate_pct" => $ratePct,
            "ait_withheld_bdt" => $aitDeductionBDT,
            "net_payable_bdt" => $netPayableBDT
        ];
    }
}
