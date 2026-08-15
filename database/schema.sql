-- =============================================================================
-- NIRMAN ERP - ENTERPRISE REAL ESTATE & CONSTRUCTION ERP (BANGLADESH EDITION)
-- MySQL 8.0+ Production Database Schema
-- Standard: InnoDB, Strict Foreign Keys, Indexes, DECIMAL(15,2) Financial Precision
-- =============================================================================

-- Note: Database already exists on InfinityFree
-- CREATE DATABASE IF NOT EXISTS `if0_42333746_mk_pos` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `if0_42333746_mk_pos`;

-- Disable Foreign Key checks for clean script execution
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. ORGANIZATIONAL & PROJECT STRUCTURE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(150) NOT NULL,
  `tin_number` VARCHAR(50) DEFAULT NULL,
  `bin_number` VARCHAR(50) DEFAULT NULL,
  `address` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `branches`;
CREATE TABLE `branches` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `company_id` INT UNSIGNED NOT NULL,
  `branch_name` VARCHAR(100) NOT NULL,
  `city` VARCHAR(50) NOT NULL DEFAULT 'Dhaka',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_branches_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `company_id` INT UNSIGNED NOT NULL,
  `branch_id` INT UNSIGNED NOT NULL,
  `project_code` VARCHAR(30) UNIQUE NOT NULL,
  `project_name` VARCHAR(150) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `total_land_katha` DECIMAL(10, 2) DEFAULT '0.00',
  `total_units` INT DEFAULT '0',
  `estimated_budget_bdt` DECIMAL(15, 2) NOT NULL DEFAULT '0.00',
  `status` ENUM('Planning', 'Under Construction', 'Handover Phase', 'Completed') DEFAULT 'Under Construction',
  `start_date` DATE DEFAULT NULL,
  `target_completion_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_project_code` (`project_code`),
  CONSTRAINT `fk_projects_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `fk_projects_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `blocks_towers`;
CREATE TABLE `blocks_towers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `tower_name` VARCHAR(50) NOT NULL, -- e.g., 'Tower A', 'Tower B'
  `total_floors` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_towers_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `floors`;
CREATE TABLE `floors` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tower_id` INT UNSIGNED NOT NULL,
  `floor_number` INT NOT NULL, -- 1 = 1st Floor, 2 = 2nd Floor
  `floor_label` VARCHAR(30) NOT NULL, -- '1st Floor', 'Ground Floor', 'Penthouse'
  CONSTRAINT `fk_floors_tower` FOREIGN KEY (`tower_id`) REFERENCES `blocks_towers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 2. DEVELOPER SALES & UNIT INVENTORY MATRIX
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `units`;
CREATE TABLE `units` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `tower_id` INT UNSIGNED NOT NULL,
  `floor_id` INT UNSIGNED NOT NULL,
  `unit_number` VARCHAR(30) NOT NULL, -- e.g., '12-A', 'B-402'
  `unit_type` ENUM('Residential 3BR', 'Residential 4BR', 'Commercial Shop', 'Duplex', 'Penthouse') DEFAULT 'Residential 3BR',
  `size_sqft` DECIMAL(10, 2) NOT NULL,
  `rate_per_sqft_bdt` DECIMAL(12, 2) NOT NULL,
  `parking_price_bdt` DECIMAL(12, 2) DEFAULT '0.00',
  `total_price_bdt` DECIMAL(15, 2) NOT NULL,
  `status` ENUM('Available', 'Booked', 'Sold', 'HandedOver') DEFAULT 'Available',
  `buyer_name` VARCHAR(150) DEFAULT NULL,
  `buyer_phone` VARCHAR(30) DEFAULT NULL,
  `buyer_nid` VARCHAR(50) DEFAULT NULL,
  `booking_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_unit_status` (`status`),
  KEY `idx_project_tower` (`project_id`, `tower_id`),
  CONSTRAINT `fk_units_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `fk_units_tower` FOREIGN KEY (`tower_id`) REFERENCES `blocks_towers` (`id`),
  CONSTRAINT `fk_units_floor` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 3. BOQ (BILL OF QUANTITIES) & BUDGET CAPPING
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `boq_items`;
CREATE TABLE `boq_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `item_code` VARCHAR(50) NOT NULL,
  `category` ENUM('Civil', 'Electrical', 'Plumbing', 'Finishing', 'Structure', 'Equipment') NOT NULL,
  `item_description` VARCHAR(255) NOT NULL,
  `unit_of_measure` VARCHAR(20) NOT NULL, -- 'Ton', 'CFT', 'SFT', 'Bags', 'Nos', 'Sft'
  `estimated_qty` DECIMAL(12, 3) NOT NULL DEFAULT '0.000',
  `budget_rate_bdt` DECIMAL(12, 2) NOT NULL DEFAULT '0.00',
  `total_budget_bdt` DECIMAL(15, 2) GENERATED ALWAYS AS (`estimated_qty` * `budget_rate_bdt`) STORED,
  `consumed_qty` DECIMAL(12, 3) NOT NULL DEFAULT '0.000',
  CONSTRAINT `fk_boq_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 4. VENDORS & SUBCONTRACTORS
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `vendors`;
CREATE TABLE `vendors` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `vendor_name` VARCHAR(150) NOT NULL,
  `vendor_code` VARCHAR(30) UNIQUE NOT NULL,
  `vendor_type` ENUM('Material Supplier', 'Equipment Vendor', 'Subcontractor', 'Service Provider') NOT NULL,
  `tin_number` VARCHAR(50) DEFAULT NULL,
  `bin_mushak_no` VARCHAR(50) DEFAULT NULL,
  `default_ait_rate_pct` DECIMAL(5, 2) DEFAULT '5.00', -- BD TDS rate
  `phone` VARCHAR(30) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `address` TEXT,
  `bank_name` VARCHAR(100) DEFAULT NULL,
  `bank_account_no` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 5. SUBCONTRACTOR RA BILLS (RUNNING ACCOUNT) & MEASUREMENT BOOK (MB)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `subcontractor_ra_bills`;
CREATE TABLE `subcontractor_ra_bills` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `bill_number` VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'RA-GHT-2026-001'
  `project_id` INT UNSIGNED NOT NULL,
  `vendor_id` INT UNSIGNED NOT NULL, -- Subcontractor
  `mb_number` VARCHAR(50) NOT NULL, -- Measurement Book Ref
  `bill_date` DATE NOT NULL,
  `work_description` VARCHAR(255) NOT NULL,
  `gross_amount` DECIMAL(15, 2) NOT NULL,
  `retention_rate_pct` DECIMAL(5, 2) NOT NULL DEFAULT '10.00', -- Retention Money (e.g., 10%)
  `retention_amount` DECIMAL(15, 2) NOT NULL,
  `ait_rate_pct` DECIMAL(5, 2) NOT NULL DEFAULT '5.00', -- BD Tax Withholding (e.g. 5%)
  `ait_amount` DECIMAL(15, 2) NOT NULL,
  `vat_rate_pct` DECIMAL(5, 2) DEFAULT '0.00',
  `vat_amount` DECIMAL(15, 2) DEFAULT '0.00',
  `other_deductions` DECIMAL(15, 2) DEFAULT '0.00',
  `net_payable` DECIMAL(15, 2) NOT NULL,
  `status` ENUM('Draft', 'Submitted', 'Approved', 'Paid', 'Rejected') DEFAULT 'Draft',
  `approved_at` TIMESTAMP NULL DEFAULT NULL,
  `auto_journal_id` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_ra_status` (`status`),
  CONSTRAINT `fk_ra_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `fk_ra_vendor` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 6. PROCUREMENT WORKFLOW (PR -> PO -> GRN -> STOCK LEDGER)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `purchase_requisitions`;
CREATE TABLE `purchase_requisitions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `pr_number` VARCHAR(50) UNIQUE NOT NULL,
  `project_id` INT UNSIGNED NOT NULL,
  `requisition_date` DATE NOT NULL,
  `priority` ENUM('Normal', 'Urgent', 'Critical Site Hold') DEFAULT 'Normal',
  `status` ENUM('Pending Approval', 'Approved', 'PO Created', 'Rejected') DEFAULT 'Pending Approval',
  `created_by` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pr_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `purchase_orders`;
CREATE TABLE `purchase_orders` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `po_number` VARCHAR(50) UNIQUE NOT NULL,
  `pr_id` INT UNSIGNED DEFAULT NULL,
  `project_id` INT UNSIGNED NOT NULL,
  `vendor_id` INT UNSIGNED NOT NULL,
  `po_date` DATE NOT NULL,
  `delivery_deadline` DATE DEFAULT NULL,
  `subtotal_bdt` DECIMAL(15, 2) NOT NULL,
  `vat_amount_bdt` DECIMAL(15, 2) DEFAULT '0.00',
  `ait_amount_bdt` DECIMAL(15, 2) DEFAULT '0.00',
  `grand_total_bdt` DECIMAL(15, 2) NOT NULL,
  `status` ENUM('Issued', 'Partially Received', 'Fully Received', 'Cancelled') DEFAULT 'Issued',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_po_pr` FOREIGN KEY (`pr_id`) REFERENCES `purchase_requisitions` (`id`),
  CONSTRAINT `fk_po_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `fk_po_vendor` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `goods_received_notes`;
CREATE TABLE `goods_received_notes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `grn_number` VARCHAR(50) UNIQUE NOT NULL,
  `po_id` INT UNSIGNED NOT NULL,
  `project_id` INT UNSIGNED NOT NULL,
  `received_date` DATE NOT NULL,
  `chalan_number` VARCHAR(50) NOT NULL, -- Vendor Truck Chalan
  `vehicle_no` VARCHAR(50) DEFAULT NULL,
  `site_store_keeper` VARCHAR(100) NOT NULL,
  `status` ENUM('Verified', 'Stock Updated', 'Rejected') DEFAULT 'Verified',
  `auto_journal_id` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_grn_po` FOREIGN KEY (`po_id`) REFERENCES `purchase_orders` (`id`),
  CONSTRAINT `fk_grn_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `grn_items`;
CREATE TABLE `grn_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `grn_id` INT UNSIGNED NOT NULL,
  `boq_item_id` INT UNSIGNED DEFAULT NULL,
  `item_code` VARCHAR(50) NOT NULL,
  `item_description` VARCHAR(255) NOT NULL,
  `unit_of_measure` VARCHAR(20) NOT NULL,
  `received_qty` DECIMAL(12, 3) NOT NULL,
  `accepted_qty` DECIMAL(12, 3) NOT NULL,
  `rejected_qty` DECIMAL(12, 3) DEFAULT '0.000',
  `unit_price_bdt` DECIMAL(12, 2) NOT NULL,
  `total_value_bdt` DECIMAL(15, 2) GENERATED ALWAYS AS (`accepted_qty` * `unit_price_bdt`) STORED,
  CONSTRAINT `fk_grn_items_grn` FOREIGN KEY (`grn_id`) REFERENCES `goods_received_notes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `store_stock_ledger`;
CREATE TABLE `store_stock_ledger` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `item_code` VARCHAR(50) NOT NULL,
  `item_name` VARCHAR(150) NOT NULL,
  `unit` VARCHAR(20) NOT NULL,
  `current_balance` DECIMAL(12, 3) NOT NULL DEFAULT '0.000',
  `reorder_level` DECIMAL(12, 3) DEFAULT '10.000',
  `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_project_item` (`project_id`, `item_code`),
  CONSTRAINT `fk_stock_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `material_transfer_notes`;
CREATE TABLE `material_transfer_notes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `mtn_number` VARCHAR(50) UNIQUE NOT NULL,
  `from_project_id` INT UNSIGNED NOT NULL,
  `to_project_id` INT UNSIGNED NOT NULL,
  `transfer_date` DATE NOT NULL,
  `driver_name` VARCHAR(100) DEFAULT NULL,
  `vehicle_no` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('In Transit', 'Received', 'Cancelled') DEFAULT 'In Transit',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_mtn_from` FOREIGN KEY (`from_project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `fk_mtn_to` FOREIGN KEY (`to_project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 7. MOBILE DAILY PROGRESS REPORT (DPR)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `daily_progress_reports`;
CREATE TABLE `daily_progress_reports` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `dpr_date` DATE NOT NULL,
  `weather_condition` VARCHAR(50) DEFAULT 'Sunny',
  `site_engineer_name` VARCHAR(100) NOT NULL,
  `mason_count` INT DEFAULT 0,
  `rod_binder_count` INT DEFAULT 0,
  `carpenter_count` INT DEFAULT 0,
  `electrician_count` INT DEFAULT 0,
  `helper_count` INT DEFAULT 0,
  `execution_summary` TEXT NOT NULL,
  `store_issues_summary` TEXT,
  `site_photo_urls` JSON DEFAULT NULL,
  `status` ENUM('Draft', 'Submitted', 'Verified') DEFAULT 'Submitted',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_dpr_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 8. CORE ACCOUNTING, COST CENTERS & AUTO-JOURNALS
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `chart_of_accounts`;
CREATE TABLE `chart_of_accounts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `account_code` VARCHAR(30) UNIQUE NOT NULL, -- e.g. '1010-CASH', '5010-REBAR'
  `account_name` VARCHAR(150) NOT NULL,
  `parent_code` VARCHAR(30) DEFAULT NULL,
  `account_type` ENUM('Asset', 'Liability', 'Equity', 'Revenue', 'Expense') NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `gl_journals`;
CREATE TABLE `gl_journals` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `journal_number` VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'JV-2026-00891'
  `journal_date` DATE NOT NULL,
  `source_doc_type` ENUM('GRN', 'RA_BILL', 'PAYMENT_VOUCHER', 'RECEIPT_VOUCHER', 'MANUAL') NOT NULL,
  `source_doc_id` INT UNSIGNED DEFAULT NULL,
  `narration` TEXT NOT NULL,
  `total_debit` DECIMAL(15, 2) NOT NULL,
  `total_credit` DECIMAL(15, 2) NOT NULL,
  `posted_by` VARCHAR(100) DEFAULT 'System Auto-Journal',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_journal_date` (`journal_date`),
  KEY `idx_source_doc` (`source_doc_type`, `source_doc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `journal_entry_lines`;
CREATE TABLE `journal_entry_lines` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `journal_id` INT UNSIGNED NOT NULL,
  `account_id` INT UNSIGNED NOT NULL,
  `debit` DECIMAL(15, 2) NOT NULL DEFAULT '0.00',
  `credit` DECIMAL(15, 2) NOT NULL DEFAULT '0.00',
  `cost_center_project_id` INT UNSIGNED DEFAULT NULL, -- Project Cost Center
  `remarks` VARCHAR(255) DEFAULT NULL,
  CONSTRAINT `fk_jel_journal` FOREIGN KEY (`journal_id`) REFERENCES `gl_journals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jel_account` FOREIGN KEY (`account_id`) REFERENCES `chart_of_accounts` (`id`),
  CONSTRAINT `fk_jel_project` FOREIGN KEY (`cost_center_project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 9. PDC CHEQUES & CASH/BANK LIFE CYCLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `pdc_cheques`;
CREATE TABLE `pdc_cheques` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `cheque_number` VARCHAR(50) NOT NULL,
  `bank_name` VARCHAR(100) NOT NULL, -- e.g. 'Dutch-Bangla Bank', 'City Bank', 'EBL'
  `party_type` ENUM('Vendor', 'Subcontractor', 'Buyer') NOT NULL,
  `party_name` VARCHAR(150) NOT NULL,
  `cheque_date` DATE NOT NULL,
  `amount_bdt` DECIMAL(15, 2) NOT NULL,
  `cheque_type` ENUM('Payment_Issued', 'Receipt_Received') NOT NULL,
  `status` ENUM('Issued', 'Deposited', 'Cleared', 'Bounced') DEFAULT 'Issued',
  `clearance_date` DATE DEFAULT NULL,
  `bounce_reason` VARCHAR(255) DEFAULT NULL,
  `journal_id` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_cheque_status` (`status`, `cheque_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Re-enable foreign key constraints
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- END OF SCHEMA SCRIPT
-- =============================================================================
