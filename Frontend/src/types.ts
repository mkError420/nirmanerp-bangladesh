export type ProjectStatus = 'Planning' | 'Under Construction' | 'Handover Phase' | 'Completed';

// ==========================================
// 1. DEPARTMENTAL WORKFLOW MANAGEMENT
// ==========================================
export type DepartmentCode = 'PURCHASE' | 'STORE' | 'COSTING' | 'PROJECT' | 'ACCOUNTS' | 'HR' | 'ADMIN';

export interface WorkflowStage {
  id: string;
  department: DepartmentCode;
  name: string;
  sequence: number;
  description: string;
  activeCount: number;
  color: string;
}

export interface StageGateApproval {
  id: string;
  documentType: 'REQUISITION' | 'PURCHASE_ORDER' | 'GRN' | 'RA_BILL' | 'PAYMENT_VOUCHER' | 'SALARY_SHEET';
  documentNumber: string;
  projectName: string;
  requestedBy: string;
  department: DepartmentCode;
  amountBDT: number;
  submissionDate: string;
  status: 'PENDING_SITE_MGR' | 'PENDING_PROCUREMENT_HEAD' | 'PENDING_COST_ENG' | 'PENDING_FINANCE_MGR' | 'APPROVED' | 'REJECTED';
  currentNodeTitle: string;
  assignedRole: string;
  remarks?: string;
  history: {
    node: string;
    action: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    by: string;
    timestamp: string;
    comment: string;
  }[];
}

export interface DepartmentAlert {
  id: string;
  sourceDept: DepartmentCode;
  targetDept: DepartmentCode;
  title: string;
  message: string;
  timestamp: string;
  documentRef: string;
  isRead: boolean;
  channel: 'IN_APP' | 'SMS' | 'BOTH';
  smsDelivered?: boolean;
}

// ==========================================
// 2. MULTI-USER & RBAC & AUDIT
// ==========================================
export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'PROCUREMENT_OFFICER' 
  | 'STORE_KEEPER' 
  | 'COST_ENGINEER' 
  | 'SITE_PROJECT_MANAGER' 
  | 'SITE_ENGINEER' 
  | 'FINANCE_MANAGER' 
  | 'HR_OFFICER';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: DepartmentCode;
  assignedProjectIds: number[];
  canApprove: boolean;
  avatarInitials: string;
}

export interface UserPermission {
  module: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canApprove: boolean;
  fieldRestrictions?: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  department: DepartmentCode;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'EXPORT' | 'LOGIN';
  entity: string;
  entityId: string;
  ipAddress: string;
  previousValue?: string;
  updatedValue?: string;
}

// ==========================================
// 3. SUPPLIER & CONTRACTOR MANAGEMENT
// ==========================================
export type VendorType = 'Material Supplier' | 'Equipment Vendor' | 'Subcontractor' | 'Service Provider';
export type SubcontractorTrade = 'Masonry & Plaster' | 'Rod Binding & Reinforcement' | 'Shuttering & Scaffolding' | 'Sanitary & Plumbing' | 'Electrical & Sub-station' | 'Finishing & Painting' | 'Piling & Deep Excavation';

export interface Vendor {
  id: number;
  vendor_name: string;
  vendor_code: string;
  vendor_type: VendorType;
  trade_specialization?: SubcontractorTrade;
  tin_number: string;
  bin_mushak_no: string;
  trade_license_no: string;
  trade_license_expiry: string;
  tax_certificate_expiry: string;
  default_ait_rate_pct: number;
  default_vat_rate_pct: number;
  credit_period_days: number;
  payment_terms: string;
  phone: string;
  email: string;
  address: string;
  bank_name: string;
  bank_account_no: string;
  bank_routing_no: string;
  rating: number; // 1 to 5
  total_billed_bdt: number;
  total_paid_bdt: number;
  outstanding_balance_bdt: number;
  retention_held_bdt: number;
  compliance_status: 'COMPLIANT' | 'EXPIRING_SOON' | 'EXPIRED';
}

export interface ComplianceDoc {
  id: string;
  vendorId: number;
  vendorName: string;
  docType: 'TRADE_LICENSE' | 'TIN_CERTIFICATE' | 'BIN_MUSHAK' | 'BANK_SOLVENCY' | 'PERFORMANCE_BOND';
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'VALID' | 'WARNING' | 'EXPIRED';
  fileUrl: string;
}

// ==========================================
// 4. SUB-PROJECT MANAGEMENT & HIERARCHY
// ==========================================
export interface Project {
  id: number;
  project_code: string;
  project_name: string;
  location: string;
  total_land_katha: number;
  total_units: number;
  estimated_budget_bdt: number;
  spent_bdt: number;
  status: ProjectStatus;
  start_date: string;
  target_completion_date: string;
  project_manager: string;
}

export interface SubProject {
  id: string;
  master_project_id: number;
  sub_project_code: string;
  sub_project_name: string;
  scope_description: string;
  allocated_budget_bdt: number;
  incurred_cost_bdt: number;
  progress_pct: number;
  start_date: string;
  completion_date: string;
  status: 'Not Started' | 'In Progress' | 'Inspection' | 'Completed';
  assigned_engineer: string;
  assigned_storekeeper: string;
  assigned_subcontractor: string;
}

export interface ProjectMilestone {
  id: string;
  sub_project_id: string;
  title: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  progress_pct: number;
  dependency_id?: string;
  critical_path: boolean;
  status: 'PENDING' | 'ACTIVE' | 'DONE';
}

export interface SiteStaffAllocation {
  id: string;
  employee_id: string;
  employee_name: string;
  role: 'Project Manager' | 'Site Engineer' | 'Storekeeper' | 'Safety Officer' | 'Quality Surveyor';
  sub_project_id: string;
  sub_project_name: string;
  allocation_date: string;
}

// ==========================================
// 5. SUBCONTRACTING & MASTER BOQ
// ==========================================
export type StandardUOM = 'CFT' | 'SFT' | 'RFT' | 'Ton' | 'Bags' | 'Nos' | 'Cum' | 'Sqm' | 'Job' | 'Meter';

export interface BOQItem {
  id: number;
  project_id: number;
  sub_project_id?: string;
  item_code: string;
  category: 'Civil' | 'Electrical' | 'Plumbing' | 'Finishing' | 'Structure' | 'Equipment';
  item_description: string;
  unit_of_measure: StandardUOM;
  estimated_qty: number;
  budget_rate_bdt: number;
  total_budget_bdt: number;
  consumed_qty: number;
}

export interface WorkOrder {
  id: string;
  wo_number: string;
  project_id: number;
  project_name: string;
  sub_project_id: string;
  sub_project_name: string;
  subcontractor_id: number;
  subcontractor_name: string;
  issue_date: string;
  completion_target: string;
  scope_summary: string;
  items: {
    boq_item_id: number;
    description: string;
    uom: StandardUOM;
    work_qty: number;
    agreed_rate_bdt: number;
    total_amount_bdt: number;
  }[];
  retention_rate_pct: number;
  total_value_bdt: number;
  billed_to_date_bdt: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'COMPLETED';
}

export type RABillStatus = 'Draft' | 'Submitted' | 'Approved' | 'Paid' | 'Rejected';

export interface RABill {
  id: number;
  bill_number: string;
  project_id: number;
  project_name?: string;
  sub_project_id?: string;
  sub_project_name?: string;
  vendor_id: number;
  subcontractor_name: string;
  mb_number: string;
  bill_date: string;
  work_description: string;
  previous_measured_qty?: number;
  current_measured_qty?: number;
  cumulative_qty?: number;
  gross_amount: number;
  retention_rate_pct: number;
  retention_amount: number;
  cash_advance_recovery_bdt: number; // Agro / Advance recovery
  material_backcharge_bdt: number;   // Materials supplied directly to subcontractor
  ait_rate_pct: number;
  ait_amount: number;
  vat_rate_pct: number;
  vat_amount: number;
  other_deductions: number;
  net_payable: number;
  status: RABillStatus;
  approved_at?: string;
  auto_journal_id?: number;
}

// ==========================================
// 6. DOCUMENT LIBRARY & FILE MANAGEMENT
// ==========================================
export type DocCategory = 'ARCHITECTURAL_DRAWINGS' | 'STRUCTURAL_CAD' | 'CONTRACTS_AGREEMENTS' | 'TEST_REPORTS' | 'NBR_TAX_CHALLAN' | 'SITE_PHOTOS';

export interface FileVersion {
  version: string;
  uploaded_at: string;
  uploaded_by: string;
  file_size: string;
  file_url: string;
  change_log: string;
}

export interface DocumentFile {
  id: string;
  project_id: number;
  sub_project_id?: string;
  department: DepartmentCode;
  category: DocCategory;
  title: string;
  filename: string;
  file_extension: 'pdf' | 'dwg' | 'jpg' | 'png' | 'xlsx' | 'docx';
  current_version: string;
  file_size: string;
  is_sensitive: boolean;
  uploaded_by: string;
  upload_date: string;
  versions: FileVersion[];
}

// ==========================================
// 7. PRODUCT CATALOG & GROUPING
// ==========================================
export interface ProductGroup {
  id: string;
  name: string;
  code: string;
  description: string;
  itemCount: number;
}

export interface ProductSubGroup {
  id: string;
  groupId: string;
  name: string;
  code: string;
}

export interface CatalogItem {
  id: string;
  sku: string;
  item_name: string;
  groupId: string;
  subGroupId: string;
  primary_uom: StandardUOM;
  secondary_uom?: string;
  conversion_factor?: number;
  brand_grade_spec: string;
  standard_purchase_rate_bdt: number;
  avg_market_price_dhaka_bdt: number;
  avg_market_price_ctg_bdt: number;
  safety_stock_level: number;
  reorder_point: number;
  current_stock: number;
  hsn_code: string;
}

// ==========================================
// 8. PURCHASE ORDER (PO) ENGINE
// ==========================================
export interface PRItem {
  id: number;
  catalog_item_id?: string;
  item_code: string;
  item_name: string;
  req_qty: number;
  unit: StandardUOM;
  estimated_rate_bdt?: number;
  remarks?: string;
}

export interface PurchaseRequisition {
  id: number;
  pr_number: string;
  project_id: number;
  project_name?: string;
  requisition_date: string;
  priority: 'Normal' | 'Urgent' | 'Critical Site Hold';
  status: 'Pending Approval' | 'Approved' | 'PO Created' | 'Rejected';
  created_by: string;
  delivery_site: string;
  items: PRItem[];
}

export interface POItem {
  id: number;
  item_code: string;
  item_name: string;
  spec: string;
  qty: number;
  unit: StandardUOM;
  unit_rate_bdt: number;
  total_bdt: number;
  received_qty: number;
}

export type POLifecycleStatus = 'Draft' | 'Under Review' | 'Approved' | 'Issued' | 'Partially Received' | 'Closed' | 'Cancelled';

export interface PurchaseOrder {
  id: number;
  po_number: string;
  pr_id?: number;
  pr_number?: string;
  project_id: number;
  project_name?: string;
  vendor_id: number;
  vendor_name: string;
  po_date: string;
  delivery_deadline: string;
  delivery_site_store: string;
  payment_terms: string;
  items: POItem[];
  subtotal_bdt: number;
  vat_rate_pct: number;
  vat_amount_bdt: number;
  ait_rate_pct: number;
  ait_amount_bdt: number;
  grand_total_bdt: number;
  status: POLifecycleStatus;
  approved_by?: string;
  approval_date?: string;
}

// ==========================================
// 9. STORE & INVENTORY MANAGEMENT
// ==========================================
export interface GRNItem {
  id: number;
  item_code: string;
  item_description: string;
  unit_of_measure: StandardUOM;
  received_qty: number;
  accepted_qty: number;
  rejected_qty: number;
  rejection_reason?: string;
  unit_price_bdt: number;
  total_value_bdt: number;
}

export interface GRN {
  id: number;
  grn_number: string;
  po_id: number;
  po_number?: string;
  project_id: number;
  project_name?: string;
  vendor_id: number;
  vendor_name: string;
  received_date: string;
  chalan_number: string;
  vehicle_no: string;
  driver_name: string;
  driver_contact: string;
  site_store_keeper: string;
  status: 'Verified' | 'Stock Updated' | 'Rejected';
  auto_journal_id?: number;
  items: GRNItem[];
}

export interface GatePassLog {
  id: string;
  gate_pass_number: string;
  project_id: number;
  project_name: string;
  entry_timestamp: string;
  exit_timestamp?: string;
  vehicle_no: string;
  supplier_name: string;
  chalan_no: string;
  material_description: string;
  weight_or_qty: string;
  security_guard: string;
  status: 'IN_PREMISES' | 'UNLOADED_EXITED';
}

export interface StoreIssueVoucher {
  id: string;
  siv_number: string;
  project_id: number;
  project_name: string;
  sub_project_id: string;
  sub_project_name: string;
  issue_date: string;
  issued_to_type: 'Subcontractor' | 'Direct Labor' | 'Equipment Operator';
  issued_to_name: string;
  task_reference: string;
  items: {
    item_code: string;
    item_name: string;
    qty: number;
    unit: StandardUOM;
    unit_cost_bdt: number;
    total_cost_bdt: number;
  }[];
  total_issue_value_bdt: number;
  storekeeper_name: string;
  receiver_signature_name: string;
}

export interface StockTransfer {
  id: string;
  transfer_number: string;
  source_project_id: number;
  source_project_name: string;
  target_project_id: number;
  target_project_name: string;
  transfer_date: string;
  item_code: string;
  item_name: string;
  qty: number;
  unit: StandardUOM;
  valuation_rate_bdt: number;
  total_transfer_bdt: number;
  status: 'IN_TRANSIT' | 'RECEIVED' | 'CANCELLED';
}

export interface StockLedgerItem {
  id: number;
  project_id: number;
  project_name?: string;
  item_code: string;
  item_name: string;
  category: string;
  unit: StandardUOM;
  current_balance: number;
  reorder_level: number;
  avg_unit_cost_bdt: number;
  total_stock_value_bdt: number;
}

// ==========================================
// 10. EMPLOYEE & HR MANAGEMENT
// ==========================================
export type EmploymentType = 'Permanent' | 'Contractual' | 'Daily Wage (Hazira)';
export type LaborSkillCategory = 'Head Mason (Rajmistri)' | 'Rod Binder (Steel Fixer)' | 'Shuttering Carpenter' | 'Electrician / Plumber' | 'Helper / General Labor';

export interface Employee {
  id: string;
  employee_code: string;
  name: string;
  nid_number: string;
  phone: string;
  emergency_contact: string;
  designation: string;
  department: DepartmentCode;
  project_id: number;
  project_name: string;
  employment_type: EmploymentType;
  joining_date: string;
  basic_salary_bdt: number;
  house_rent_bdt: number;
  medical_allowance_bdt: number;
  transport_allowance_bdt: number;
  site_hazard_allowance_bdt: number;
  gross_monthly_salary_bdt: number;
  daily_wage_rate_bdt?: number;
  bank_name: string;
  bank_account_no: string;
  bkash_nagad_wallet?: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED';
}

export interface DailyWageHaziraLog {
  id: string;
  date: string;
  project_id: number;
  project_name: string;
  sub_project_name: string;
  contractor_or_gang_leader: string;
  category: LaborSkillCategory;
  worker_count: number;
  daily_rate_bdt: number;
  overtime_hours: number;
  ot_rate_per_hour_bdt: number;
  total_day_amount_bdt: number;
  site_supervisor: string;
}

// ==========================================
// 11. PRINTABLE SALARY SHEET GENERATOR
// ==========================================
export interface MonthlyPayrollRecord {
  id: string;
  payroll_month: string; // e.g. "February 2026"
  employee_id: string;
  employee_code: string;
  name: string;
  designation: string;
  department: DepartmentCode;
  project_id: number;
  project_name: string;
  basic_bdt: number;
  allowances_bdt: number;
  overtime_bdt: number;
  gross_earnings_bdt: number;
  absence_deductions_bdt: number;
  site_cash_advance_agro_bdt: number;
  tax_tds_deductions_bdt: number;
  other_deductions_bdt: number;
  total_deductions_bdt: number;
  net_salary_bdt: number;
  payout_channel: 'BANK_BEFTN' | 'BKASH_NAGAD' | 'CASH';
  disbursal_status: 'UNPAID' | 'PROCESSED' | 'DISBURSED';
  disbursal_reference?: string;
}

// ==========================================
// 12. SALARY PAYMENT & DISBURSAL
// ==========================================
export interface DisbursalBatch {
  id: string;
  batch_number: string;
  month: string;
  channel: 'BEFTN' | 'BKASH_MFS' | 'CASH';
  total_employees: number;
  total_disbursed_bdt: number;
  processed_date: string;
  bank_source_account: string;
  status: 'GENERATED' | 'SENT_TO_BANK' | 'SETTLED';
  auto_journal_posted: boolean;
}

// ==========================================
// 13. FINANCIAL ACCOUNTING & DOUBLE ENTRY
// ==========================================
export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
export type VoucherType = 'PAYMENT_VOUCHER' | 'RECEIPT_VOUCHER' | 'JOURNAL_VOUCHER' | 'CONTRA_VOUCHER';

export interface ChartOfAccount {
  id: number;
  account_code: string;
  account_name: string;
  parent_code?: string;
  account_type: AccountType;
  category: 'Direct Cost' | 'Site Overhead' | 'Current Asset' | 'Fixed Asset' | 'Current Liability' | 'Equity' | 'Operating Revenue';
  balance_bdt: number;
}

export interface JournalLine {
  id: number;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  cost_center_project_id?: number;
  remarks?: string;
}

export interface GLJournal {
  id: number;
  journal_number: string;
  journal_date: string;
  voucher_type: VoucherType;
  source_doc_type: 'GRN' | 'RA_BILL' | 'PAYMENT_VOUCHER' | 'RECEIPT_VOUCHER' | 'SALARY_PAYROLL' | 'CONTRA' | 'MANUAL';
  source_doc_id?: number | string;
  source_doc_ref?: string;
  narration: string;
  total_debit: number;
  total_credit: number;
  posted_by: string;
  lines: JournalLine[];
}

export interface ThreeWayMatchVerification {
  id: string;
  vendor_id: number;
  vendor_name: string;
  po_number: string;
  po_amount_bdt: number;
  grn_number: string;
  grn_accepted_value_bdt: number;
  vendor_invoice_number: string;
  invoice_amount_bdt: number;
  variance_bdt: number;
  match_status: 'PERFECT_MATCH' | 'TOLERABLE_VARIANCE' | 'MISMATCH_HOLD';
  ap_release_status: 'HELD' | 'APPROVED_FOR_PAYMENT' | 'PAID';
}

export type PDCStatus = 'Issued' | 'Deposited' | 'Cleared' | 'Bounced';

export interface PDCCheque {
  id: number;
  cheque_number: string;
  bank_name: string;
  party_type: 'Vendor' | 'Subcontractor' | 'Buyer';
  party_name: string;
  cheque_date: string;
  amount_bdt: number;
  cheque_type: 'Payment_Issued' | 'Receipt_Received';
  status: PDCStatus;
  clearance_date?: string;
  bounce_reason?: string;
}

// ==========================================
// 14. STATISTICAL & ANALYTICAL REPORTS
// ==========================================
export interface ProjectCostVariance {
  sub_project_name: string;
  boq_category: string;
  budget_bdt: number;
  actual_spent_bdt: number;
  variance_bdt: number;
  variance_pct: number;
  status: 'UNDER_BUDGET' | 'ON_TRACK' | 'OVER_BUDGET';
}

export interface AgingBucket {
  party_name: string;
  party_type: 'Supplier' | 'Subcontractor' | 'Apartment Buyer';
  total_due_bdt: number;
  days_0_30: number;
  days_31_60: number;
  days_61_90: number;
  days_90_plus: number;
}

export interface MaterialConsumptionWastage {
  item_code: string;
  item_name: string;
  unit: StandardUOM;
  boq_estimated_qty: number;
  actual_issued_qty: number;
  wastage_qty: number;
  wastage_pct: number;
  allowable_limit_pct: number;
  status: 'NORMAL' | 'EXCESSIVE_WASTAGE';
}

// Site DPR & Units
export interface DailyProgressReport {
  id: number;
  project_id: number;
  project_name?: string;
  dpr_date: string;
  weather_condition: string;
  site_engineer_name: string;
  mason_count: number;
  rod_binder_count: number;
  carpenter_count: number;
  electrician_count: number;
  helper_count: number;
  execution_summary: string;
  store_issues_summary: string;
  site_photo_urls: string[];
  status: 'Draft' | 'Submitted' | 'Verified';
}

export interface Tower {
  id: number;
  project_id: number;
  tower_name: string;
  total_floors: number;
}

export type UnitStatus = 'Available' | 'Booked' | 'Sold' | 'HandedOver';

export interface Unit {
  id: number;
  project_id: number;
  tower_id: number;
  floor_id: number;
  floor_number: number;
  unit_number: string;
  unit_type: 'Residential 3BR' | 'Residential 4BR' | 'Commercial Shop' | 'Duplex' | 'Penthouse';
  size_sqft: number;
  rate_per_sqft_bdt: number;
  parking_price_bdt: number;
  total_price_bdt: number;
  status: UnitStatus;
  buyer_name?: string;
  buyer_phone?: string;
  buyer_nid?: string;
  booking_date?: string;
}
