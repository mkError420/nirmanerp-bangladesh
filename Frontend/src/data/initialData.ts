import {
  Project,
  SubProject,
  ProjectMilestone,
  SiteStaffAllocation,
  Tower,
  Unit,
  BOQItem,
  WorkOrder,
  Vendor,
  RABill,
  PurchaseRequisition,
  PurchaseOrder,
  GRN,
  GatePassLog,
  StoreIssueVoucher,
  StockTransfer,
  StockLedgerItem,
  DailyProgressReport,
  ChartOfAccount,
  GLJournal,
  PDCCheque,
  WorkflowStage,
  StageGateApproval,
  DepartmentAlert,
  SystemUser,
  AuditLogEntry,
  ComplianceDoc,
  DocumentFile,
  ProductGroup,
  ProductSubGroup,
  CatalogItem,
  Employee,
  DailyWageHaziraLog,
  MonthlyPayrollRecord,
  DisbursalBatch,
  ThreeWayMatchVerification,
  ProjectCostVariance,
  AgingBucket,
  MaterialConsumptionWastage
} from '../types';

// ==========================================
// 1. DEPARTMENTAL WORKFLOW MANAGEMENT DATA
// ==========================================
export const INITIAL_WORKFLOW_STAGES: WorkflowStage[] = [
  { id: 'STG-1', department: 'PURCHASE', name: 'Purchase & Procurement', sequence: 1, description: 'PR verification, Vendor RFQ & PO Issuance', activeCount: 4, color: 'blue' },
  { id: 'STG-2', department: 'STORE', name: 'Site Store Receiving', sequence: 2, description: 'Gate Pass, Challan & GRN Inspection', activeCount: 3, color: 'amber' },
  { id: 'STG-3', department: 'COSTING', name: 'Project Costing & BoQ', sequence: 3, description: 'Material valuation & Budget variance check', activeCount: 2, color: 'indigo' },
  { id: 'STG-4', department: 'PROJECT', name: 'Site Execution & DPR', sequence: 4, description: 'Store issues, RA bill joint measurement', activeCount: 5, color: 'emerald' },
  { id: 'STG-5', department: 'ACCOUNTS', name: 'Finance & 3-Way Match', sequence: 5, description: '3-Way invoice match & Payment voucher posting', activeCount: 6, color: 'purple' },
];

export const INITIAL_STAGE_GATE_APPROVALS: StageGateApproval[] = [
  {
    id: 'SGA-2026-001',
    documentType: 'REQUISITION',
    documentNumber: 'PR-PRB-2026-041',
    projectName: 'Purbachal Green City Tower A',
    requestedBy: 'Engr. Kamrul Hasan (Site Engr)',
    department: 'PURCHASE',
    amountBDT: 3450000,
    submissionDate: '2026-02-05 10:15 AM',
    status: 'PENDING_SITE_MGR',
    currentNodeTitle: 'Site Project Manager Requisition Sign-off',
    assignedRole: 'SITE_PROJECT_MANAGER',
    remarks: 'Urgent requirement for 9th floor slab casting schedule.',
    history: [
      { node: 'Creation', action: 'SUBMITTED', by: 'Engr. Kamrul Hasan', timestamp: '2026-02-05 10:15 AM', comment: 'Requisition submitted for 25 Ton rebar & 1200 cement bags.' },
    ]
  },
  {
    id: 'SGA-2026-002',
    documentType: 'PURCHASE_ORDER',
    documentNumber: 'PO-BSRM-2026-018',
    projectName: 'Purbachal Green City Tower A',
    requestedBy: 'Tariqul Islam (Procurement Exec)',
    department: 'PURCHASE',
    amountBDT: 2450000,
    submissionDate: '2026-02-06 02:30 PM',
    status: 'PENDING_PROCUREMENT_HEAD',
    currentNodeTitle: 'Head of Procurement Value Authorization',
    assignedRole: 'SUPER_ADMIN',
    remarks: 'BSRM official rate negotiated with 30-day credit period.',
    history: [
      { node: 'PR Conversion', action: 'SUBMITTED', by: 'Tariqul Islam', timestamp: '2026-02-06 02:30 PM', comment: 'PO generated from approved PR-041.' },
    ]
  },
  {
    id: 'SGA-2026-003',
    documentType: 'RA_BILL',
    documentNumber: 'RA-BD-202602-1099',
    projectName: 'Purbachal Green City Tower A',
    requestedBy: 'Bengal Structure & Civil Engr',
    department: 'COSTING',
    amountBDT: 4200000,
    submissionDate: '2026-02-08 04:00 PM',
    status: 'PENDING_COST_ENG',
    currentNodeTitle: 'Cost Engineer MB Joint Verification',
    assignedRole: 'COST_ENGINEER',
    remarks: 'MB #894 verified on site. 10% retention and 5% AIT applied.',
    history: [
      { node: 'Site MB Submission', action: 'SUBMITTED', by: 'Subcontractor Rep', timestamp: '2026-02-08 04:00 PM', comment: 'Bill submitted with MB measurements.' },
    ]
  },
  {
    id: 'SGA-2026-004',
    documentType: 'PAYMENT_VOUCHER',
    documentNumber: 'PV-ACCTS-2026-089',
    projectName: 'Purbachal Green City Tower A',
    requestedBy: 'Accounts Dept',
    department: 'ACCOUNTS',
    amountBDT: 2975000,
    submissionDate: '2026-02-09 11:00 AM',
    status: 'PENDING_FINANCE_MGR',
    currentNodeTitle: 'Finance Director Payment Release Approval',
    assignedRole: 'FINANCE_MANAGER',
    remarks: '3-Way matching verified against GRN & Vendor invoice.',
    history: [
      { node: '3-Way Match', action: 'SUBMITTED', by: 'Senior Accountant', timestamp: '2026-02-09 11:00 AM', comment: '3-way check passed with 0% variance.' },
    ]
  }
];

export const INITIAL_DEPARTMENT_ALERTS: DepartmentAlert[] = [
  {
    id: 'ALT-101',
    sourceDept: 'PURCHASE',
    targetDept: 'STORE',
    title: 'PO Issued → Expected Delivery Tomorrow',
    message: 'PO #PO-BSRM-2026-018 for 25 Ton BSRM 500W rebar issued to BSRM Steels. Delivery vehicle arriving tomorrow 10:00 AM.',
    timestamp: '2026-02-07 05:20 PM',
    documentRef: 'PO-BSRM-2026-018',
    isRead: false,
    channel: 'BOTH',
    smsDelivered: true
  },
  {
    id: 'ALT-102',
    sourceDept: 'STORE',
    targetDept: 'COSTING',
    title: 'GRN Stock Updated → Cost Ledger Ready',
    message: 'GRN #GRN-4912 verified at site store. 25 Ton rebar received into inventory. Cost ledger updated automatically at ৳ 98,000/Ton.',
    timestamp: '2026-02-08 01:15 PM',
    documentRef: 'GRN-4912',
    isRead: false,
    channel: 'IN_APP'
  },
  {
    id: 'ALT-103',
    sourceDept: 'COSTING',
    targetDept: 'ACCOUNTS',
    title: 'Subcontractor RA Bill Verified → Ready for Voucher',
    message: 'RA Bill #RA-BD-202602-1082 verified against MB #881. Net payable ৳ 29,75,000 released for finance voucher processing.',
    timestamp: '2026-02-08 04:45 PM',
    documentRef: 'RA-BD-202602-1082',
    isRead: true,
    channel: 'BOTH',
    smsDelivered: true
  },
  {
    id: 'ALT-104',
    sourceDept: 'HR',
    targetDept: 'ACCOUNTS',
    title: 'Monthly Site Salary Sheet Processed',
    message: 'Site Payroll for February 2026 calculated. Total Net Disbursal: ৳ 48,20,000 across 3 active project sites.',
    timestamp: '2026-02-09 09:30 AM',
    documentRef: 'PAYROLL-FEB-2026',
    isRead: false,
    channel: 'IN_APP'
  }
];

// ==========================================
// 2. MULTI-USER RBAC & AUDIT LOGS
// ==========================================
export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  { id: 'USR-001', name: 'Engr. Mahbubur Rahman', email: 'mahbub@nirmanerp.bd', phone: '+880 1711-001122', role: 'SUPER_ADMIN', department: 'ADMIN', assignedProjectIds: [1, 2, 3], canApprove: true, avatarInitials: 'MR' },
  { id: 'USR-002', name: 'Tariqul Islam', email: 'tariqul@nirmanerp.bd', phone: '+880 1819-223344', role: 'PROCUREMENT_OFFICER', department: 'PURCHASE', assignedProjectIds: [1, 2, 3], canApprove: false, avatarInitials: 'TI' },
  { id: 'USR-003', name: 'Md. Dulal Hossain', email: 'dulal.store@nirmanerp.bd', phone: '+880 1912-334455', role: 'STORE_KEEPER', department: 'STORE', assignedProjectIds: [1], canApprove: false, avatarInitials: 'DH' },
  { id: 'USR-004', name: 'Engr. Nazmul Huda', email: 'nazmul.cost@nirmanerp.bd', phone: '+880 1713-445566', role: 'COST_ENGINEER', department: 'COSTING', assignedProjectIds: [1, 2], canApprove: true, avatarInitials: 'NH' },
  { id: 'USR-005', name: 'Engr. Kamrul Hasan', email: 'kamrul.site@nirmanerp.bd', phone: '+880 1714-556677', role: 'SITE_PROJECT_MANAGER', department: 'PROJECT', assignedProjectIds: [1], canApprove: true, avatarInitials: 'KH' },
  { id: 'USR-006', name: 'Arif Elahi, ACA', email: 'arif.finance@nirmanerp.bd', phone: '+880 1811-667788', role: 'FINANCE_MANAGER', department: 'ACCOUNTS', assignedProjectIds: [1, 2, 3], canApprove: true, avatarInitials: 'AE' },
  { id: 'USR-007', name: 'Farzana Sharmin', email: 'farzana.hr@nirmanerp.bd', phone: '+880 1918-778899', role: 'HR_OFFICER', department: 'HR', assignedProjectIds: [1, 2, 3], canApprove: false, avatarInitials: 'FS' }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'AUD-901', timestamp: '2026-02-09 11:45:10', userId: 'USR-006', userName: 'Arif Elahi, ACA', userRole: 'FINANCE_MANAGER', department: 'ACCOUNTS', action: 'APPROVE', entity: 'RA_BILL', entityId: 'RA-BD-202602-1082', ipAddress: '103.145.112.45', previousValue: 'Status: Submitted', updatedValue: 'Status: Approved | Net: ৳ 2,975,000' },
  { id: 'AUD-902', timestamp: '2026-02-08 14:12:05', userId: 'USR-003', userName: 'Md. Dulal Hossain', userRole: 'STORE_KEEPER', department: 'STORE', action: 'CREATE', entity: 'GRN', entityId: 'GRN-SITE-4912', ipAddress: '192.168.1.140', previousValue: 'None', updatedValue: 'Accepted 25 Ton BSRM 500W Steel' },
  { id: 'AUD-903', timestamp: '2026-02-07 16:30:22', userId: 'USR-002', userName: 'Tariqul Islam', userRole: 'PROCUREMENT_OFFICER', department: 'PURCHASE', action: 'CREATE', entity: 'PURCHASE_ORDER', entityId: 'PO-BSRM-2026-018', ipAddress: '103.145.112.45', previousValue: 'Draft', updatedValue: 'Issued PO for ৳ 24,50,000' },
  { id: 'AUD-904', timestamp: '2026-02-06 09:15:00', userId: 'USR-005', userName: 'Engr. Kamrul Hasan', userRole: 'SITE_PROJECT_MANAGER', department: 'PROJECT', action: 'UPDATE', entity: 'DPR', entityId: 'DPR-20260206', ipAddress: '103.205.71.18', previousValue: 'Labor: 88', updatedValue: 'Labor: 92 (Verified Column Shuttering)' },
  { id: 'AUD-905', timestamp: '2026-02-05 17:00:18', userId: 'USR-007', userName: 'Farzana Sharmin', userRole: 'HR_OFFICER', department: 'HR', action: 'UPDATE', entity: 'SALARY_SHEET', entityId: 'PAY-FEB-SITE1', ipAddress: '103.145.112.48', previousValue: 'Agro Adv: ৳ 0', updatedValue: 'Reconciled ৳ 45,000 Agro Site Advances' },
];

// ==========================================
// 3. SUPPLIER & CONTRACTOR MANAGEMENT DATA
// ==========================================
export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 1,
    vendor_name: 'BSRM Steels Limited',
    vendor_code: 'VND-BSRM-01',
    vendor_type: 'Material Supplier',
    tin_number: '182940291039',
    bin_mushak_no: '000192849-0101',
    trade_license_no: 'TRAD/DSCC/019284/2023',
    trade_license_expiry: '2026-06-30',
    tax_certificate_expiry: '2026-12-31',
    default_ait_rate_pct: 3.0,
    default_vat_rate_pct: 7.5,
    credit_period_days: 30,
    payment_terms: '30 Days Net from GRN Verification',
    phone: '+880 2 3333 1920',
    email: 'sales.dhaka@bsrm.com',
    address: 'BSRM Tower, Mohakhali C/A, Dhaka-1212',
    bank_name: 'Eastern Bank Limited (EBL)',
    bank_account_no: '1011060029182',
    bank_routing_no: '095261829',
    rating: 4.9,
    total_billed_bdt: 84500000,
    total_paid_bdt: 72000000,
    outstanding_balance_bdt: 12500000,
    retention_held_bdt: 0,
    compliance_status: 'COMPLIANT'
  },
  {
    id: 2,
    vendor_name: 'Crown Cement PLC',
    vendor_code: 'VND-CRN-02',
    vendor_type: 'Material Supplier',
    tin_number: '291049201923',
    bin_mushak_no: '000284920-0201',
    trade_license_no: 'TRAD/DNCC/084921/2024',
    trade_license_expiry: '2026-06-30',
    tax_certificate_expiry: '2026-12-31',
    default_ait_rate_pct: 3.0,
    default_vat_rate_pct: 7.5,
    credit_period_days: 21,
    payment_terms: '21 Days Net upon Site Delivery Challan',
    phone: '+880 2 9882103',
    email: 'corporate@crowncement.com',
    address: 'Gulshan Avenue, Gulshan-1, Dhaka-1212',
    bank_name: 'Dutch-Bangla Bank Limited',
    bank_account_no: '1101200092812',
    bank_routing_no: '090271920',
    rating: 4.7,
    total_billed_bdt: 42000000,
    total_paid_bdt: 38500000,
    outstanding_balance_bdt: 3500000,
    retention_held_bdt: 0,
    compliance_status: 'COMPLIANT'
  },
  {
    id: 3,
    vendor_name: 'Bengal Structure & Civil Engineering (Thika)',
    vendor_code: 'SUB-BEN-01',
    vendor_type: 'Subcontractor',
    trade_specialization: 'Rod Binding & Reinforcement',
    tin_number: '301928401928',
    bin_mushak_no: '000392019-0102',
    trade_license_no: 'TRAD/GAZI/049102/2023',
    trade_license_expiry: '2026-04-15',
    tax_certificate_expiry: '2026-12-31',
    default_ait_rate_pct: 5.0,
    default_vat_rate_pct: 0.0,
    credit_period_days: 15,
    payment_terms: 'RA Bill MB Measurement Verified with 10% Retention Hold',
    phone: '+880 1713-092812',
    email: 'contact@bengalstructure.com',
    address: 'Purbachal Road, Sector 3, Uttara, Dhaka',
    bank_name: 'Islami Bank Bangladesh Ltd',
    bank_account_no: '2050109019282',
    bank_routing_no: '125261029',
    rating: 4.8,
    total_billed_bdt: 38200000,
    total_paid_bdt: 31450000,
    outstanding_balance_bdt: 2930000,
    retention_held_bdt: 3820000,
    compliance_status: 'EXPIRING_SOON'
  },
  {
    id: 4,
    vendor_name: 'Padma Shuttering & Scaffolding Works',
    vendor_code: 'SUB-PAD-02',
    vendor_type: 'Subcontractor',
    trade_specialization: 'Shuttering & Scaffolding',
    tin_number: '482019284019',
    bin_mushak_no: '000492810-0103',
    trade_license_no: 'TRAD/DSCC/077124/2024',
    trade_license_expiry: '2026-06-30',
    tax_certificate_expiry: '2026-12-31',
    default_ait_rate_pct: 5.0,
    default_vat_rate_pct: 0.0,
    credit_period_days: 15,
    payment_terms: 'Fortnightly running measurement',
    phone: '+880 1819-482910',
    email: 'padmashuttering@gmail.com',
    address: 'Sayedabad Bus Terminal Area, Dhaka',
    bank_name: 'City Bank PLC',
    bank_account_no: '1102948192001',
    bank_routing_no: '085261902',
    rating: 4.5,
    total_billed_bdt: 18500000,
    total_paid_bdt: 15100000,
    outstanding_balance_bdt: 1550000,
    retention_held_bdt: 1850000,
    compliance_status: 'COMPLIANT'
  },
  {
    id: 5,
    vendor_name: 'Karnafuli Sanitary & Plumbing Solutions',
    vendor_code: 'SUB-KAR-03',
    vendor_type: 'Subcontractor',
    trade_specialization: 'Sanitary & Plumbing',
    tin_number: '592019482019',
    bin_mushak_no: '000582910-0201',
    trade_license_no: 'TRAD/DNCC/038291/2023',
    trade_license_expiry: '2026-03-01',
    tax_certificate_expiry: '2026-12-31',
    default_ait_rate_pct: 5.0,
    default_vat_rate_pct: 0.0,
    credit_period_days: 15,
    payment_terms: 'Milestone completion and pressure testing signoff',
    phone: '+880 1912-849201',
    email: 'karnafuliplumbing@yahoo.com',
    address: 'Mirpur-10, Dhaka',
    bank_name: 'BRAC Bank PLC',
    bank_account_no: '1501209384910',
    bank_routing_no: '060261890',
    rating: 4.2,
    total_billed_bdt: 9800000,
    total_paid_bdt: 8100000,
    outstanding_balance_bdt: 720000,
    retention_held_bdt: 980000,
    compliance_status: 'EXPIRING_SOON'
  }
];

export const INITIAL_COMPLIANCE_DOCS: ComplianceDoc[] = [
  { id: 'DOC-CMP-01', vendorId: 3, vendorName: 'Bengal Structure & Civil Engr', docType: 'TRADE_LICENSE', documentNumber: 'TRAD/GAZI/049102/2023', issueDate: '2023-04-16', expiryDate: '2026-04-15', status: 'WARNING', fileUrl: '/docs/trade_license_bengal.pdf' },
  { id: 'DOC-CMP-02', vendorId: 3, vendorName: 'Bengal Structure & Civil Engr', docType: 'TIN_CERTIFICATE', documentNumber: '301928401928', issueDate: '2021-01-10', expiryDate: '2026-12-31', status: 'VALID', fileUrl: '/docs/tin_bengal.pdf' },
  { id: 'DOC-CMP-03', vendorId: 5, vendorName: 'Karnafuli Sanitary Solutions', docType: 'TRADE_LICENSE', documentNumber: 'TRAD/DNCC/038291/2023', issueDate: '2023-03-02', expiryDate: '2026-03-01', status: 'WARNING', fileUrl: '/docs/trade_license_karnafuli.pdf' },
  { id: 'DOC-CMP-04', vendorId: 1, vendorName: 'BSRM Steels Limited', docType: 'PERFORMANCE_BOND', documentNumber: 'PB-EBL-2025-992', issueDate: '2025-01-15', expiryDate: '2027-01-14', status: 'VALID', fileUrl: '/docs/bond_bsrm.pdf' }
];

// ==========================================
// 4. SUB-PROJECT MANAGEMENT & HIERARCHY DATA
// ==========================================
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    project_code: 'PRJ-BD-01',
    project_name: 'Purbachal Green City Tower Complex',
    location: 'Sector 17, Purbachal Smart City, Dhaka',
    total_land_katha: 20.0,
    total_units: 48,
    estimated_budget_bdt: 450000000, // 45 Crore BDT
    spent_bdt: 284000000,
    status: 'Under Construction',
    start_date: '2024-01-15',
    target_completion_date: '2026-12-31',
    project_manager: 'Engr. Kamrul Hasan'
  },
  {
    id: 2,
    project_code: 'PRJ-BD-02',
    project_name: 'Gulshan Heights Luxury Suites',
    location: 'Road 113, Block SE(F), Gulshan-2, Dhaka',
    total_land_katha: 12.5,
    total_units: 24,
    estimated_budget_bdt: 780000000, // 78 Crore BDT
    spent_bdt: 512000000,
    status: 'Under Construction',
    start_date: '2023-08-01',
    target_completion_date: '2026-06-30',
    project_manager: 'Engr. Shamim Reza'
  },
  {
    id: 3,
    project_code: 'PRJ-BD-03',
    project_name: 'Uttara Lakeview Residence',
    location: 'Sector 11, Lake Drive, Uttara, Dhaka',
    total_land_katha: 15.0,
    total_units: 36,
    estimated_budget_bdt: 320000000, // 32 Crore BDT
    spent_bdt: 295000000,
    status: 'Handover Phase',
    start_date: '2022-11-01',
    target_completion_date: '2025-10-31',
    project_manager: 'Engr. Tanvir Ahmed'
  }
];

export const INITIAL_SUB_PROJECTS: SubProject[] = [
  {
    id: 'SUB-PRJ-01-A',
    master_project_id: 1,
    sub_project_code: 'PRB-TWR-A',
    sub_project_name: 'Tower A (14-Storey Superstructure)',
    scope_description: 'Civil structural casting from Ground Floor to 14th Roof slab including brickwork.',
    allocated_budget_bdt: 195000000,
    incurred_cost_bdt: 132000000,
    progress_pct: 68,
    start_date: '2024-03-01',
    completion_date: '2026-09-30',
    status: 'In Progress',
    assigned_engineer: 'Engr. Kamrul Hasan',
    assigned_storekeeper: 'Md. Dulal Hossain',
    assigned_subcontractor: 'Bengal Structure & Civil Engineering'
  },
  {
    id: 'SUB-PRJ-01-B',
    master_project_id: 1,
    sub_project_code: 'PRB-BSM-01',
    sub_project_name: 'Basement & Retaining Wall Foundation',
    scope_description: 'Deep excavation, cast-in-situ piling, raft foundation and waterproof retaining walls.',
    allocated_budget_bdt: 120000000,
    incurred_cost_bdt: 118500000,
    progress_pct: 100,
    start_date: '2024-01-15',
    completion_date: '2024-11-30',
    status: 'Completed',
    assigned_engineer: 'Engr. Tariqul Islam',
    assigned_storekeeper: 'Md. Dulal Hossain',
    assigned_subcontractor: 'Meghna Piling Works'
  },
  {
    id: 'SUB-PRJ-01-C',
    master_project_id: 1,
    sub_project_code: 'PRB-POD-RET',
    sub_project_name: 'Podium Commercial & Amenities Wing',
    scope_description: 'Community hall, gymnasium, swimming pool filtration deck and retail frontage.',
    allocated_budget_bdt: 85000000,
    incurred_cost_bdt: 24500000,
    progress_pct: 29,
    start_date: '2025-01-10',
    completion_date: '2026-11-30',
    status: 'In Progress',
    assigned_engineer: 'Engr. Anisur Rahman',
    assigned_storekeeper: 'Md. Dulal Hossain',
    assigned_subcontractor: 'Padma Shuttering Works'
  },
  {
    id: 'SUB-PRJ-01-D',
    master_project_id: 1,
    sub_project_code: 'PRB-UTL-ELE',
    sub_project_name: 'Substation, Generator & MEP Works',
    scope_description: '1000 KVA electrical substation, 500 KVA standby generator, central water pump & fire hydrant ring.',
    allocated_budget_bdt: 50000000,
    incurred_cost_bdt: 9000000,
    progress_pct: 18,
    start_date: '2025-06-01',
    completion_date: '2026-12-15',
    status: 'In Progress',
    assigned_engineer: 'Engr. Mofazzal Hossain',
    assigned_storekeeper: 'Md. Dulal Hossain',
    assigned_subcontractor: 'Surma MEP Tech'
  }
];

export const INITIAL_MILESTONES: ProjectMilestone[] = [
  { id: 'MLS-101', sub_project_id: 'SUB-PRJ-01-A', title: 'Basement to Ground Floor Plinth Casting', start_date: '2024-03-01', end_date: '2024-05-30', duration_days: 90, progress_pct: 100, critical_path: true, status: 'DONE' },
  { id: 'MLS-102', sub_project_id: 'SUB-PRJ-01-A', title: '1st to 6th Floor Superstructure Casting', start_date: '2024-06-01', end_date: '2024-12-15', duration_days: 195, progress_pct: 100, critical_path: true, status: 'DONE' },
  { id: 'MLS-103', sub_project_id: 'SUB-PRJ-01-A', title: '7th to 10th Floor Slab & Column Casting', start_date: '2024-12-16', end_date: '2025-05-30', duration_days: 165, progress_pct: 85, critical_path: true, status: 'ACTIVE' },
  { id: 'MLS-104', sub_project_id: 'SUB-PRJ-01-A', title: '11th to 14th Roof Slab Final Pouring', start_date: '2025-06-01', end_date: '2025-11-30', duration_days: 180, progress_pct: 0, critical_path: true, status: 'PENDING' },
  { id: 'MLS-105', sub_project_id: 'SUB-PRJ-01-A', title: 'External Brick Masonry & 1st Coat Plaster', start_date: '2025-04-01', end_date: '2026-03-31', duration_days: 365, progress_pct: 40, critical_path: false, status: 'ACTIVE' },
  { id: 'MLS-106', sub_project_id: 'SUB-PRJ-01-D', title: 'Transformer & Substation HT Panel Installation', start_date: '2025-08-01', end_date: '2026-02-28', duration_days: 210, progress_pct: 25, critical_path: false, status: 'ACTIVE' },
];

export const INITIAL_STAFF_ALLOCATIONS: SiteStaffAllocation[] = [
  { id: 'ALC-01', employee_id: 'EMP-001', employee_name: 'Engr. Kamrul Hasan', role: 'Project Manager', sub_project_id: 'SUB-PRJ-01-A', sub_project_name: 'Tower A (14-Storey Superstructure)', allocation_date: '2024-01-15' },
  { id: 'ALC-02', employee_id: 'EMP-004', employee_name: 'Md. Dulal Hossain', role: 'Storekeeper', sub_project_id: 'SUB-PRJ-01-A', sub_project_name: 'Tower A (14-Storey Superstructure)', allocation_date: '2024-01-15' },
  { id: 'ALC-03', employee_id: 'EMP-002', employee_name: 'Engr. Anisur Rahman', role: 'Site Engineer', sub_project_id: 'SUB-PRJ-01-C', sub_project_name: 'Podium Commercial Wing', allocation_date: '2025-01-10' },
  { id: 'ALC-04', employee_id: 'EMP-003', employee_name: 'Md. Saiful Islam', role: 'Quality Surveyor', sub_project_id: 'SUB-PRJ-01-A', sub_project_name: 'Tower A (14-Storey Superstructure)', allocation_date: '2024-03-01' }
];

// ==========================================
// 5. MASTER BOQ & WORK ORDERS DATA
// ==========================================
export const INITIAL_BOQ_ITEMS: BOQItem[] = [
  {
    id: 1,
    project_id: 1,
    sub_project_id: 'SUB-PRJ-01-A',
    item_code: 'BOQ-CIV-001',
    category: 'Civil',
    item_description: '500G High Yield TMT Rebar (60G/72.5G BSRM/KSRM)',
    unit_of_measure: 'Ton',
    estimated_qty: 450,
    budget_rate_bdt: 98000,
    total_budget_bdt: 44100000,
    consumed_qty: 290,
  },
  {
    id: 2,
    project_id: 1,
    sub_project_id: 'SUB-PRJ-01-A',
    item_code: 'BOQ-CIV-002',
    category: 'Civil',
    item_description: 'Portland Composite Cement (Crown / Holcim PCC Bags)',
    unit_of_measure: 'Bags',
    estimated_qty: 28000,
    budget_rate_bdt: 540,
    total_budget_bdt: 15120000,
    consumed_qty: 18500,
  },
  {
    id: 3,
    project_id: 1,
    sub_project_id: 'SUB-PRJ-01-A',
    item_code: 'BOQ-CIV-003',
    category: 'Civil',
    item_description: '1st Class Auto Brick (Mirpur Brick Works)',
    unit_of_measure: 'Nos',
    estimated_qty: 650000,
    budget_rate_bdt: 14.50,
    total_budget_bdt: 9425000,
    consumed_qty: 420000,
  },
  {
    id: 4,
    project_id: 1,
    sub_project_id: 'SUB-PRJ-01-A',
    item_code: 'BOQ-CIV-004',
    category: 'Civil',
    item_description: 'Coarse Sylhet Sand (FM 2.5)',
    unit_of_measure: 'CFT',
    estimated_qty: 120000,
    budget_rate_bdt: 68,
    total_budget_bdt: 8160000,
    consumed_qty: 82000,
  },
  {
    id: 5,
    project_id: 1,
    sub_project_id: 'SUB-PRJ-01-A',
    item_code: 'BOQ-STR-001',
    category: 'Structure',
    item_description: 'R.C.C Column & Beam Casting Work (Thika Subcontractor Rate)',
    unit_of_measure: 'CFT',
    estimated_qty: 85000,
    budget_rate_bdt: 180,
    total_budget_bdt: 15300000,
    consumed_qty: 54000,
  },
  {
    id: 6,
    project_id: 1,
    sub_project_id: 'SUB-PRJ-01-A',
    item_code: 'BOQ-STR-002',
    category: 'Structure',
    item_description: 'Steel Shuttering, Staging & Centering for Slabs & Beams',
    unit_of_measure: 'SFT',
    estimated_qty: 240000,
    budget_rate_bdt: 45,
    total_budget_bdt: 10800000,
    consumed_qty: 158000,
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-BEN-2024-001',
    wo_number: 'WO-BD-PRB-2024-088',
    project_id: 1,
    project_name: 'Purbachal Green City Tower Complex',
    sub_project_id: 'SUB-PRJ-01-A',
    sub_project_name: 'Tower A (14-Storey Superstructure)',
    subcontractor_id: 3,
    subcontractor_name: 'Bengal Structure & Civil Engineering',
    issue_date: '2024-02-20',
    completion_target: '2026-08-31',
    scope_summary: 'Complete Rod Binding, Shuttering & Casting work for Tower A floors 1 to 14.',
    items: [
      { boq_item_id: 5, description: 'R.C.C Column & Beam Casting Work', uom: 'CFT', work_qty: 85000, agreed_rate_bdt: 180, total_amount_bdt: 15300000 },
      { boq_item_id: 6, description: 'Steel Shuttering & Staging', uom: 'SFT', work_qty: 240000, agreed_rate_bdt: 45, total_amount_bdt: 10800000 }
    ],
    retention_rate_pct: 10,
    total_value_bdt: 26100000,
    billed_to_date_bdt: 18500000,
    status: 'ACTIVE'
  }
];

export const INITIAL_RA_BILLS: RABill[] = [
  {
    id: 1,
    bill_number: 'RA-BD-202602-1082',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    sub_project_id: 'SUB-PRJ-01-A',
    sub_project_name: 'Tower A (14-Storey Superstructure)',
    vendor_id: 3,
    subcontractor_name: 'Bengal Structure & Civil Engineering',
    mb_number: 'MB-SITE-2026-881',
    bill_date: '2026-02-01',
    work_description: '8th Floor Column Reinforcement & Beam Shuttering Casting Work',
    previous_measured_qty: 48000,
    current_measured_qty: 6000,
    cumulative_qty: 54000,
    gross_amount: 3500000, // 35 Lac BDT
    retention_rate_pct: 10.0,
    retention_amount: 350000,
    cash_advance_recovery_bdt: 0,
    material_backcharge_bdt: 0,
    ait_rate_pct: 5.0,
    ait_amount: 175000,
    vat_rate_pct: 0.0,
    vat_amount: 0.0,
    other_deductions: 0.0,
    net_payable: 2975000, // 29.75 Lac Net
    status: 'Approved',
    approved_at: '2026-02-03 11:30:00',
    auto_journal_id: 101,
  },
  {
    id: 2,
    bill_number: 'RA-BD-202602-1099',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    sub_project_id: 'SUB-PRJ-01-A',
    sub_project_name: 'Tower A (14-Storey Superstructure)',
    vendor_id: 3,
    subcontractor_name: 'Bengal Structure & Civil Engineering',
    mb_number: 'MB-SITE-2026-894',
    bill_date: '2026-02-08',
    work_description: '9th Floor Slab Concrete Pouring & Curing Work (22,000 Sft)',
    previous_measured_qty: 136000,
    current_measured_qty: 22000,
    cumulative_qty: 158000,
    gross_amount: 4200000, // 42 Lac BDT
    retention_rate_pct: 10.0,
    retention_amount: 420000,
    cash_advance_recovery_bdt: 150000, // Agro advance recovered
    material_backcharge_bdt: 60000,   // Direct diesel issue back-charge
    ait_rate_pct: 5.0,
    ait_amount: 210000,
    vat_rate_pct: 0.0,
    vat_amount: 0.0,
    other_deductions: 0.0,
    net_payable: 3360000,
    status: 'Submitted',
  },
];

// ==========================================
// 6. DOCUMENT LIBRARY & FILE MANAGEMENT DATA
// ==========================================
export const INITIAL_DOCUMENT_FILES: DocumentFile[] = [
  {
    id: 'DOC-001',
    project_id: 1,
    sub_project_id: 'SUB-PRJ-01-A',
    department: 'PROJECT',
    category: 'ARCHITECTURAL_DRAWINGS',
    title: 'Tower A - Architectural Floor Layout (Floors 1 to 14)',
    filename: 'Purbachal_TowerA_Arch_Rev2.pdf',
    file_extension: 'pdf',
    current_version: 'v2.1',
    file_size: '14.8 MB',
    is_sensitive: false,
    uploaded_by: 'Engr. Kamrul Hasan',
    upload_date: '2026-01-20',
    versions: [
      { version: 'v2.1', uploaded_at: '2026-01-20', uploaded_by: 'Engr. Kamrul Hasan', file_size: '14.8 MB', file_url: '/docs/purbachal_arch_v2_1.pdf', change_log: 'Adjusted balcony duct line and fire exit doors.' },
      { version: 'v1.0', uploaded_at: '2024-02-10', uploaded_by: 'Engr. Shamim Reza', file_size: '12.4 MB', file_url: '/docs/purbachal_arch_v1_0.pdf', change_log: 'Initial approved architectural set from Vitti Sthapati.' }
    ]
  },
  {
    id: 'DOC-002',
    project_id: 1,
    sub_project_id: 'SUB-PRJ-01-A',
    department: 'PROJECT',
    category: 'STRUCTURAL_CAD',
    title: 'Tower A - Structural Column Schedule & Reinforcement Details',
    filename: 'Purbachal_Struct_Columns_C1_C8.dwg',
    file_extension: 'dwg',
    current_version: 'v1.3',
    file_size: '28.5 MB',
    is_sensitive: false,
    uploaded_by: 'Engr. Nazmul Huda',
    upload_date: '2025-11-14',
    versions: [
      { version: 'v1.3', uploaded_at: '2025-11-14', uploaded_by: 'Engr. Nazmul Huda', file_size: '28.5 MB', file_url: '/docs/purbachal_struct_v1_3.dwg', change_log: 'BUET testing lab approved tie bar spacing for 7th-10th floor.' }
    ]
  },
  {
    id: 'DOC-003',
    project_id: 1,
    department: 'ACCOUNTS',
    category: 'CONTRACTS_AGREEMENTS',
    title: 'Master Subcontract Agreement - Bengal Structure & Civil Engr',
    filename: 'Subcontract_Agreement_Bengal_Signed.pdf',
    file_extension: 'pdf',
    current_version: 'v1.0',
    file_size: '6.2 MB',
    is_sensitive: true,
    uploaded_by: 'Arif Elahi, ACA',
    upload_date: '2024-02-25',
    versions: [
      { version: 'v1.0', uploaded_at: '2024-02-25', uploaded_by: 'Arif Elahi, ACA', file_size: '6.2 MB', file_url: '/docs/subcontract_bengal.pdf', change_log: 'Signed legal contract with 10% retention and 300 Tk non-judicial stamp.' }
    ]
  },
  {
    id: 'DOC-004',
    project_id: 1,
    sub_project_id: 'SUB-PRJ-01-A',
    department: 'STORE',
    category: 'TEST_REPORTS',
    title: 'BUET Rebar Tensile Strength & Elongation Test Report (BSRM 500W)',
    filename: 'BUET_Rebar_Test_BSRM_Batch994.pdf',
    file_extension: 'pdf',
    current_version: 'v1.0',
    file_size: '3.1 MB',
    is_sensitive: false,
    uploaded_by: 'Md. Dulal Hossain',
    upload_date: '2026-02-08',
    versions: [
      { version: 'v1.0', uploaded_at: '2026-02-08', uploaded_by: 'Md. Dulal Hossain', file_size: '3.1 MB', file_url: '/docs/buet_test_rebar.pdf', change_log: 'Test certified yield strength > 540 MPa.' }
    ]
  }
];

// ==========================================
// 7. PRODUCT CATALOG & GROUPING DATA
// ==========================================
export const INITIAL_PRODUCT_GROUPS: ProductGroup[] = [
  { id: 'GRP-CIV', name: 'Civil Construction Materials', code: 'CIV-MAT', description: 'Raw materials for structural casting and masonry', itemCount: 18 },
  { id: 'GRP-ELE', name: 'Electrical & MEP Supplies', code: 'ELE-MEP', description: 'Cables, conduit pipes, switchgear and transformers', itemCount: 12 },
  { id: 'GRP-PLM', name: 'Plumbing & Sanitary', code: 'PLM-SAN', description: 'uPVC, CPVC pipes, fittings, valves and fixtures', itemCount: 14 },
  { id: 'GRP-FIN', name: 'Finishing & Architectural', code: 'FIN-ARC', description: 'Tiles, marble, sanitaryware, paints and doors', itemCount: 22 }
];

export const INITIAL_PRODUCT_SUB_GROUPS: ProductSubGroup[] = [
  { id: 'SUB-AGG', groupId: 'GRP-CIV', name: 'Aggregates & Sand', code: 'AGG-SND' },
  { id: 'SUB-BND', groupId: 'GRP-CIV', name: 'Binders & Cement', code: 'BND-CMT' },
  { id: 'SUB-RBR', groupId: 'GRP-CIV', name: 'Reinforcement Rebar', code: 'RBR-STL' },
  { id: 'SUB-BRK', groupId: 'GRP-CIV', name: 'Bricks & Masonry Blocks', code: 'BRK-MAS' },
];

export const INITIAL_CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'CAT-001',
    sku: 'CIV-RBR-16MM',
    item_name: 'BSRM 500W TMT Rebar (16mm)',
    groupId: 'GRP-CIV',
    subGroupId: 'SUB-RBR',
    primary_uom: 'Ton',
    brand_grade_spec: 'BSRM Xtreme 500W Grade 72.5',
    standard_purchase_rate_bdt: 98000,
    avg_market_price_dhaka_bdt: 99500,
    avg_market_price_ctg_bdt: 96500,
    safety_stock_level: 15.0,
    reorder_point: 20.0,
    current_stock: 42.50,
    hsn_code: '7214.20.00'
  },
  {
    id: 'CAT-002',
    sku: 'CIV-RBR-20MM',
    item_name: 'BSRM 500W TMT Rebar (20mm)',
    groupId: 'GRP-CIV',
    subGroupId: 'SUB-RBR',
    primary_uom: 'Ton',
    brand_grade_spec: 'BSRM Xtreme 500W Grade 72.5',
    standard_purchase_rate_bdt: 98500,
    avg_market_price_dhaka_bdt: 100000,
    avg_market_price_ctg_bdt: 97000,
    safety_stock_level: 10.0,
    reorder_point: 15.0,
    current_stock: 12.00,
    hsn_code: '7214.20.00'
  },
  {
    id: 'CAT-003',
    sku: 'CIV-CMT-PCC',
    item_name: 'Crown Portland Composite Cement (PCC)',
    groupId: 'GRP-CIV',
    subGroupId: 'SUB-BND',
    primary_uom: 'Bags',
    brand_grade_spec: 'Crown PCC BDS EN 197-1 CEM II/B-M 42.5N',
    standard_purchase_rate_bdt: 540,
    avg_market_price_dhaka_bdt: 560,
    avg_market_price_ctg_bdt: 530,
    safety_stock_level: 300,
    reorder_point: 500,
    current_stock: 850,
    hsn_code: '2523.29.00'
  },
  {
    id: 'CAT-004',
    sku: 'CIV-CMT-OPC',
    item_name: 'Holcim Water Protect OPC Cement',
    groupId: 'GRP-CIV',
    subGroupId: 'SUB-BND',
    primary_uom: 'Bags',
    brand_grade_spec: 'LafargeHolcim OPC CEM I 52.5N Water Shield',
    standard_purchase_rate_bdt: 610,
    avg_market_price_dhaka_bdt: 630,
    avg_market_price_ctg_bdt: 600,
    safety_stock_level: 150,
    reorder_point: 250,
    current_stock: 180, // Near reorder point
    hsn_code: '2523.29.00'
  },
  {
    id: 'CAT-005',
    sku: 'CIV-SND-SYL',
    item_name: 'Sylhet Coarse Red Sand (FM 2.5)',
    groupId: 'GRP-CIV',
    subGroupId: 'SUB-AGG',
    primary_uom: 'CFT',
    brand_grade_spec: 'Sylhet River Basin Coarse FM 2.5 - 2.8',
    standard_purchase_rate_bdt: 68,
    avg_market_price_dhaka_bdt: 72,
    avg_market_price_ctg_bdt: 70,
    safety_stock_level: 1500,
    reorder_point: 2500,
    current_stock: 3800,
    hsn_code: '2505.10.00'
  },
  {
    id: 'CAT-006',
    sku: 'CIV-BRK-AUTO',
    item_name: '1st Class Gas-Fired Auto Bricks',
    groupId: 'GRP-CIV',
    subGroupId: 'SUB-BRK',
    primary_uom: 'Nos',
    brand_grade_spec: 'Mirpur Standard Auto Kiln (Crushing Strength > 3500 PSI)',
    standard_purchase_rate_bdt: 14.50,
    avg_market_price_dhaka_bdt: 15.00,
    avg_market_price_ctg_bdt: 15.50,
    safety_stock_level: 15000,
    reorder_point: 25000,
    current_stock: 45000,
    hsn_code: '6901.00.00'
  }
];

// ==========================================
// 8. PURCHASE ORDER (PO) ENGINE DATA
// ==========================================
export const INITIAL_PR: PurchaseRequisition[] = [
  {
    id: 1,
    pr_number: 'PR-PRB-2026-041',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    requisition_date: '2026-02-05',
    priority: 'Urgent',
    status: 'Approved',
    created_by: 'Engr. Kamrul Hasan (Site Engineer)',
    delivery_site: 'Site Store 1, Sector 17, Purbachal',
    items: [
      { id: 1, catalog_item_id: 'CAT-001', item_code: 'CIV-RBR-16MM', item_name: '16mm TMT Steel Rebar (BSRM 500W)', req_qty: 25, unit: 'Ton', estimated_rate_bdt: 98000 },
      { id: 2, catalog_item_id: 'CAT-003', item_code: 'CIV-CMT-PCC', item_name: 'Crown PCC Cement Bags', req_qty: 1200, unit: 'Bags', estimated_rate_bdt: 540 },
    ],
  },
  {
    id: 2,
    pr_number: 'PR-PRB-2026-042',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    requisition_date: '2026-02-08',
    priority: 'Critical Site Hold',
    status: 'Pending Approval',
    created_by: 'Md. Dulal Hossain (Store Keeper)',
    delivery_site: 'Site Store 1, Sector 17, Purbachal',
    items: [
      { id: 3, catalog_item_id: 'CAT-004', item_code: 'CIV-CMT-OPC', item_name: 'Holcim Water Protect OPC Cement', req_qty: 500, unit: 'Bags', estimated_rate_bdt: 610, remarks: 'Needed for water retaining structure' }
    ]
  }
];

export const INITIAL_PO: PurchaseOrder[] = [
  {
    id: 1,
    po_number: 'PO-BSRM-2026-018',
    pr_id: 1,
    pr_number: 'PR-PRB-2026-041',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    vendor_id: 1,
    vendor_name: 'BSRM Steels Limited',
    po_date: '2026-02-06',
    delivery_deadline: '2026-02-12',
    delivery_site_store: 'Central Site Store, Sector 17, Purbachal',
    payment_terms: '30 Days Net from GRN Verification',
    items: [
      { id: 1, item_code: 'CIV-RBR-16MM', item_name: 'BSRM 500W TMT Rebar (16mm)', spec: 'BSRM Xtreme 500W Grade 72.5', qty: 25, unit: 'Ton', unit_rate_bdt: 98000, total_bdt: 2450000, received_qty: 25 }
    ],
    subtotal_bdt: 2450000,
    vat_rate_pct: 0.0,
    vat_amount_bdt: 0,
    ait_rate_pct: 3.0,
    ait_amount_bdt: 73500,
    grand_total_bdt: 2450000,
    status: 'Issued',
    approved_by: 'Engr. Mahbubur Rahman (Director)',
    approval_date: '2026-02-06'
  },
  {
    id: 2,
    po_number: 'PO-CRN-2026-022',
    pr_id: 1,
    pr_number: 'PR-PRB-2026-041',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    vendor_id: 2,
    vendor_name: 'Crown Cement PLC',
    po_date: '2026-02-07',
    delivery_deadline: '2026-02-14',
    delivery_site_store: 'Central Site Store, Sector 17, Purbachal',
    payment_terms: '21 Days Net upon Site Delivery Challan',
    items: [
      { id: 2, item_code: 'CIV-CMT-PCC', item_name: 'Crown Portland Composite Cement (PCC)', spec: 'Crown PCC CEM II/B-M 42.5N', qty: 1200, unit: 'Bags', unit_rate_bdt: 540, total_bdt: 648000, received_qty: 0 }
    ],
    subtotal_bdt: 648000,
    vat_rate_pct: 0.0,
    vat_amount_bdt: 0,
    ait_rate_pct: 3.0,
    ait_amount_bdt: 19440,
    grand_total_bdt: 648000,
    status: 'Approved',
    approved_by: 'Engr. Mahbubur Rahman (Director)',
    approval_date: '2026-02-07'
  }
];

// ==========================================
// 9. STORE & INVENTORY MANAGEMENT DATA
// ==========================================
export const INITIAL_GRN: GRN[] = [
  {
    id: 1,
    grn_number: 'GRN-SITE-20260208-4912',
    po_id: 1,
    po_number: 'PO-BSRM-2026-018',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    vendor_id: 1,
    vendor_name: 'BSRM Steels Limited',
    received_date: '2026-02-08',
    chalan_number: 'BSRM-CHALAN-88491',
    vehicle_no: 'Dhaka Metro-TA-11-9284',
    driver_name: 'Md. Rustam Ali',
    driver_contact: '+880 1718-992019',
    site_store_keeper: 'Md. Dulal Hossain (Store Keeper)',
    status: 'Stock Updated',
    auto_journal_id: 104,
    items: [
      {
        id: 1,
        item_code: 'CIV-RBR-16MM',
        item_description: '16mm TMT Steel Rebar (BSRM 500W Grade 72.5)',
        unit_of_measure: 'Ton',
        received_qty: 25.0,
        accepted_qty: 25.0,
        rejected_qty: 0,
        unit_price_bdt: 98000,
        total_value_bdt: 2450000
      }
    ]
  },
  {
    id: 2,
    grn_number: 'GRN-SITE-20260204-4889',
    po_id: 2,
    po_number: 'PO-CRN-2026-012',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    vendor_id: 2,
    vendor_name: 'Crown Cement PLC',
    received_date: '2026-02-04',
    chalan_number: 'CRN-CHL-009218',
    vehicle_no: 'Chatto Metro-U-14-5512',
    driver_name: 'Anwar Hossain',
    driver_contact: '+880 1819-204918',
    site_store_keeper: 'Md. Dulal Hossain',
    status: 'Stock Updated',
    auto_journal_id: 103,
    items: [
      {
        id: 2,
        item_code: 'CIV-CMT-PCC',
        item_description: 'Crown PCC Cement Bags (50kg)',
        unit_of_measure: 'Bags',
        received_qty: 600,
        accepted_qty: 580,
        rejected_qty: 20,
        rejection_reason: '20 bags water-damaged and hardened in transit during rain',
        unit_price_bdt: 540,
        total_value_bdt: 313200
      }
    ]
  }
];

export const INITIAL_GATE_PASSES: GatePassLog[] = [
  {
    id: 'GP-2026-041',
    gate_pass_number: 'GP-PRB-0041',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    entry_timestamp: '2026-02-08 09:30 AM',
    exit_timestamp: '2026-02-08 11:45 AM',
    vehicle_no: 'Dhaka Metro-TA-11-9284',
    supplier_name: 'BSRM Steels Limited',
    chalan_no: 'BSRM-CHALAN-88491',
    material_description: '16mm TMT Rebar (25 Ton)',
    weight_or_qty: '25.0 Ton (Gross 34.2 Ton Tare 9.2 Ton)',
    security_guard: 'Havildar (Retd) Anwar Hossain',
    status: 'UNLOADED_EXITED'
  },
  {
    id: 'GP-2026-042',
    gate_pass_number: 'GP-PRB-0042',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    entry_timestamp: '2026-02-09 08:15 AM',
    vehicle_no: 'Dhaka Metro-GA-13-8821',
    supplier_name: 'Mirpur Brick Works',
    chalan_no: 'MIR-BRK-4091',
    material_description: '1st Class Auto Bricks',
    weight_or_qty: '12,000 Nos',
    security_guard: 'Havildar (Retd) Anwar Hossain',
    status: 'IN_PREMISES'
  }
];

export const INITIAL_STORE_ISSUE_VOUCHERS: StoreIssueVoucher[] = [
  {
    id: 'SIV-2026-118',
    siv_number: 'SIV-PRB-0118',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    sub_project_id: 'SUB-PRJ-01-A',
    sub_project_name: 'Tower A (14-Storey Superstructure)',
    issue_date: '2026-02-08',
    issued_to_type: 'Subcontractor',
    issued_to_name: 'Bengal Structure & Civil Engineering',
    task_reference: '9th Floor Column & Beam Reinforcement Binding',
    items: [
      { item_code: 'CIV-RBR-16MM', item_name: '16mm TMT Steel Rebar', qty: 8.5, unit: 'Ton', unit_cost_bdt: 98000, total_cost_bdt: 833000 },
      { item_code: 'CIV-CMT-PCC', item_name: 'Crown PCC Cement Bags', qty: 140, unit: 'Bags', unit_cost_bdt: 540, total_cost_bdt: 75600 }
    ],
    total_issue_value_bdt: 908600,
    storekeeper_name: 'Md. Dulal Hossain',
    receiver_signature_name: 'Foreman Motiur Rahman'
  }
];

export const INITIAL_STOCK_TRANSFERS: StockTransfer[] = [
  {
    id: 'TRF-001',
    transfer_number: 'ST-2026-004',
    source_project_id: 2,
    source_project_name: 'Gulshan Heights Luxury Suites',
    target_project_id: 1,
    target_project_name: 'Purbachal Green City Tower A',
    transfer_date: '2026-01-28',
    item_code: 'CIV-RBR-20MM',
    item_name: 'BSRM 500W TMT Rebar (20mm)',
    qty: 5.0,
    unit: 'Ton',
    valuation_rate_bdt: 98500,
    total_transfer_bdt: 492500,
    status: 'RECEIVED'
  }
];

export const INITIAL_STOCK_LEDGER: StockLedgerItem[] = [
  { id: 1, project_id: 1, project_name: 'Purbachal Green City Tower A', item_code: 'CIV-RBR-16MM', item_name: '16mm TMT Steel Rebar (BSRM 500W)', category: 'Civil', unit: 'Ton', current_balance: 42.50, reorder_level: 20.0, avg_unit_cost_bdt: 98000, total_stock_value_bdt: 4165000 },
  { id: 2, project_id: 1, project_name: 'Purbachal Green City Tower A', item_code: 'CIV-RBR-20MM', item_name: '20mm TMT Steel Rebar (BSRM 500W)', category: 'Civil', unit: 'Ton', current_balance: 12.00, reorder_level: 15.0, avg_unit_cost_bdt: 98500, total_stock_value_bdt: 1182000 },
  { id: 3, project_id: 1, project_name: 'Purbachal Green City Tower A', item_code: 'CIV-CMT-PCC', item_name: 'Crown PCC Cement Bags', category: 'Civil', unit: 'Bags', current_balance: 850.00, reorder_level: 500.0, avg_unit_cost_bdt: 540, total_stock_value_bdt: 459000 },
  { id: 4, project_id: 1, project_name: 'Purbachal Green City Tower A', item_code: 'CIV-CMT-OPC', item_name: 'Holcim Water Protect OPC Cement', category: 'Civil', unit: 'Bags', current_balance: 180.00, reorder_level: 250.0, avg_unit_cost_bdt: 610, total_stock_value_bdt: 109800 },
  { id: 5, project_id: 1, project_name: 'Purbachal Green City Tower A', item_code: 'CIV-BRK-AUTO', item_name: '1st Class Auto Bricks', category: 'Civil', unit: 'Nos', current_balance: 45000.00, reorder_level: 25000.0, avg_unit_cost_bdt: 14.50, total_stock_value_bdt: 652500 },
  { id: 6, project_id: 1, project_name: 'Purbachal Green City Tower A', item_code: 'CIV-SND-SYL', item_name: 'Sylhet Coarse Sand (FM 2.5)', category: 'Civil', unit: 'CFT', current_balance: 3800.00, reorder_level: 2500.0, avg_unit_cost_bdt: 68, total_stock_value_bdt: 258400 },
];

// ==========================================
// 10. EMPLOYEE & HR MANAGEMENT DATA
// ==========================================
export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    employee_code: 'NRM-ENG-01',
    name: 'Engr. Kamrul Hasan',
    nid_number: '19852691204910',
    phone: '+880 1714-556677',
    emergency_contact: 'Mrs. Rokeya Begum (Wife): +880 1711-228899',
    designation: 'Senior Project Manager',
    department: 'PROJECT',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    employment_type: 'Permanent',
    joining_date: '2020-03-01',
    basic_salary_bdt: 60000,
    house_rent_bdt: 30000,
    medical_allowance_bdt: 6000,
    transport_allowance_bdt: 10000,
    site_hazard_allowance_bdt: 9000,
    gross_monthly_salary_bdt: 115000,
    bank_name: 'City Bank PLC',
    bank_account_no: '1102948192001',
    bkash_nagad_wallet: '+880 1714-556677',
    status: 'ACTIVE'
  },
  {
    id: 'EMP-002',
    employee_code: 'NRM-ENG-02',
    name: 'Engr. Anisur Rahman',
    nid_number: '19902610294812',
    phone: '+880 1819-334411',
    emergency_contact: 'Md. Abdur Rahim (Father): +880 1819-223399',
    designation: 'Site Civil Engineer',
    department: 'PROJECT',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    employment_type: 'Permanent',
    joining_date: '2022-06-15',
    basic_salary_bdt: 40000,
    house_rent_bdt: 20000,
    medical_allowance_bdt: 4000,
    transport_allowance_bdt: 6000,
    site_hazard_allowance_bdt: 5000,
    gross_monthly_salary_bdt: 75000,
    bank_name: 'Dutch-Bangla Bank Limited',
    bank_account_no: '1101200049281',
    bkash_nagad_wallet: '+880 1819-334411',
    status: 'ACTIVE'
  },
  {
    id: 'EMP-003',
    employee_code: 'NRM-QS-01',
    name: 'Md. Saiful Islam',
    nid_number: '19922681920391',
    phone: '+880 1912-778822',
    emergency_contact: 'Md. Nurul Islam (Brother): +880 1912-665544',
    designation: 'Quality Surveyor & Billing Engr',
    department: 'COSTING',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    employment_type: 'Permanent',
    joining_date: '2023-01-10',
    basic_salary_bdt: 35000,
    house_rent_bdt: 17500,
    medical_allowance_bdt: 3500,
    transport_allowance_bdt: 5000,
    site_hazard_allowance_bdt: 4000,
    gross_monthly_salary_bdt: 65000,
    bank_name: 'BRAC Bank PLC',
    bank_account_no: '1501209384910',
    bkash_nagad_wallet: '+880 1912-778822',
    status: 'ACTIVE'
  },
  {
    id: 'EMP-004',
    employee_code: 'NRM-STR-01',
    name: 'Md. Dulal Hossain',
    nid_number: '19872601928312',
    phone: '+880 1912-334455',
    emergency_contact: 'Md. Alamgir Hossain (Brother): +880 1912-110022',
    designation: 'Head Site Storekeeper',
    department: 'STORE',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    employment_type: 'Permanent',
    joining_date: '2021-08-01',
    basic_salary_bdt: 25000,
    house_rent_bdt: 12500,
    medical_allowance_bdt: 2500,
    transport_allowance_bdt: 4000,
    site_hazard_allowance_bdt: 3000,
    gross_monthly_salary_bdt: 47000,
    bank_name: 'Islami Bank Bangladesh Ltd',
    bank_account_no: '2050109019282',
    bkash_nagad_wallet: '+880 1912-334455',
    status: 'ACTIVE'
  },
  {
    id: 'EMP-005',
    employee_code: 'NRM-SFT-01',
    name: 'Md. Jahangir Alam',
    nid_number: '19892671829012',
    phone: '+880 1718-449922',
    emergency_contact: 'Mrs. Salma Khatun (Wife): +880 1718-338811',
    designation: 'Site Safety & Security Officer',
    department: 'PROJECT',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    employment_type: 'Contractual',
    joining_date: '2024-01-01',
    basic_salary_bdt: 22000,
    house_rent_bdt: 11000,
    medical_allowance_bdt: 2000,
    transport_allowance_bdt: 3000,
    site_hazard_allowance_bdt: 4000,
    gross_monthly_salary_bdt: 42000,
    bank_name: 'bKash Corporate Payout',
    bank_account_no: '01718449922',
    bkash_nagad_wallet: '+880 1718-449922',
    status: 'ACTIVE'
  }
];

export const INITIAL_HAZIRA_LOGS: DailyWageHaziraLog[] = [
  {
    id: 'HAZ-20260209-01',
    date: '2026-02-09',
    project_id: 1,
    project_name: 'Purbachal Green City Tower Complex',
    sub_project_name: 'Tower A (14-Storey Superstructure)',
    contractor_or_gang_leader: 'Sardar Mizanur Rahman Gang',
    category: 'Head Mason (Rajmistri)',
    worker_count: 18,
    daily_rate_bdt: 950,
    overtime_hours: 36,
    ot_rate_per_hour_bdt: 120,
    total_day_amount_bdt: 21420,
    site_supervisor: 'Engr. Kamrul Hasan'
  },
  {
    id: 'HAZ-20260209-02',
    date: '2026-02-09',
    project_id: 1,
    project_name: 'Purbachal Green City Tower Complex',
    sub_project_name: 'Tower A (14-Storey Superstructure)',
    contractor_or_gang_leader: 'Sardar Ali Hossain Gang',
    category: 'Rod Binder (Steel Fixer)',
    worker_count: 24,
    daily_rate_bdt: 900,
    overtime_hours: 48,
    ot_rate_per_hour_bdt: 110,
    total_day_amount_bdt: 26880,
    site_supervisor: 'Engr. Kamrul Hasan'
  },
  {
    id: 'HAZ-20260209-03',
    date: '2026-02-09',
    project_id: 1,
    project_name: 'Purbachal Green City Tower Complex',
    sub_project_name: 'Tower A (14-Storey Superstructure)',
    contractor_or_gang_leader: 'Sardar Babul Mia Gang',
    category: 'Shuttering Carpenter',
    worker_count: 12,
    daily_rate_bdt: 880,
    overtime_hours: 24,
    ot_rate_per_hour_bdt: 110,
    total_day_amount_bdt: 13200,
    site_supervisor: 'Engr. Kamrul Hasan'
  },
  {
    id: 'HAZ-20260209-04',
    date: '2026-02-09',
    project_id: 1,
    project_name: 'Purbachal Green City Tower Complex',
    sub_project_name: 'Tower A (14-Storey Superstructure)',
    contractor_or_gang_leader: 'General Site Labor Pool',
    category: 'Helper / General Labor',
    worker_count: 32,
    daily_rate_bdt: 650,
    overtime_hours: 64,
    ot_rate_per_hour_bdt: 80,
    total_day_amount_bdt: 25920,
    site_supervisor: 'Engr. Kamrul Hasan'
  }
];

// ==========================================
// 11. PRINTABLE SALARY SHEET DATA
// ==========================================
export const INITIAL_PAYROLL_RECORDS: MonthlyPayrollRecord[] = [
  {
    id: 'PAY-202602-001',
    payroll_month: 'February 2026',
    employee_id: 'EMP-001',
    employee_code: 'NRM-ENG-01',
    name: 'Engr. Kamrul Hasan',
    designation: 'Senior Project Manager',
    department: 'PROJECT',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    basic_bdt: 60000,
    allowances_bdt: 55000,
    overtime_bdt: 0,
    gross_earnings_bdt: 115000,
    absence_deductions_bdt: 0,
    site_cash_advance_agro_bdt: 10000, // Agro advance recovered
    tax_tds_deductions_bdt: 4500,     // AIT/TDS Tax
    other_deductions_bdt: 0,
    total_deductions_bdt: 14500,
    net_salary_bdt: 100500,
    payout_channel: 'BANK_BEFTN',
    disbursal_status: 'PROCESSED',
    disbursal_reference: 'BEFTN-FEB26-091'
  },
  {
    id: 'PAY-202602-002',
    payroll_month: 'February 2026',
    employee_id: 'EMP-002',
    employee_code: 'NRM-ENG-02',
    name: 'Engr. Anisur Rahman',
    designation: 'Site Civil Engineer',
    department: 'PROJECT',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    basic_bdt: 40000,
    allowances_bdt: 35000,
    overtime_bdt: 4800,
    gross_earnings_bdt: 79800,
    absence_deductions_bdt: 0,
    site_cash_advance_agro_bdt: 5000,
    tax_tds_deductions_bdt: 1500,
    other_deductions_bdt: 0,
    total_deductions_bdt: 6500,
    net_salary_bdt: 73300,
    payout_channel: 'BANK_BEFTN',
    disbursal_status: 'PROCESSED',
    disbursal_reference: 'BEFTN-FEB26-092'
  },
  {
    id: 'PAY-202602-003',
    payroll_month: 'February 2026',
    employee_id: 'EMP-003',
    employee_code: 'NRM-QS-01',
    name: 'Md. Saiful Islam',
    designation: 'Quality Surveyor & Billing Engr',
    department: 'COSTING',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    basic_bdt: 35000,
    allowances_bdt: 30000,
    overtime_bdt: 2400,
    gross_earnings_bdt: 67400,
    absence_deductions_bdt: 0,
    site_cash_advance_agro_bdt: 0,
    tax_tds_deductions_bdt: 1000,
    other_deductions_bdt: 0,
    total_deductions_bdt: 1000,
    net_salary_bdt: 66400,
    payout_channel: 'BANK_BEFTN',
    disbursal_status: 'PROCESSED',
    disbursal_reference: 'BEFTN-FEB26-093'
  },
  {
    id: 'PAY-202602-004',
    payroll_month: 'February 2026',
    employee_id: 'EMP-004',
    employee_code: 'NRM-STR-01',
    name: 'Md. Dulal Hossain',
    designation: 'Head Site Storekeeper',
    department: 'STORE',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    basic_bdt: 25000,
    allowances_bdt: 22000,
    overtime_bdt: 3600,
    gross_earnings_bdt: 50600,
    absence_deductions_bdt: 0,
    site_cash_advance_agro_bdt: 4000,
    tax_tds_deductions_bdt: 0,
    other_deductions_bdt: 0,
    total_deductions_bdt: 4000,
    net_salary_bdt: 46600,
    payout_channel: 'BKASH_NAGAD',
    disbursal_status: 'PROCESSED',
    disbursal_reference: 'MFS-BK-202602-18'
  },
  {
    id: 'PAY-202602-005',
    payroll_month: 'February 2026',
    employee_id: 'EMP-005',
    employee_code: 'NRM-SFT-01',
    name: 'Md. Jahangir Alam',
    designation: 'Site Safety & Security Officer',
    department: 'PROJECT',
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    basic_bdt: 22000,
    allowances_bdt: 20000,
    overtime_bdt: 2000,
    gross_earnings_bdt: 44000,
    absence_deductions_bdt: 1400,
    site_cash_advance_agro_bdt: 2000,
    tax_tds_deductions_bdt: 0,
    other_deductions_bdt: 0,
    total_deductions_bdt: 3400,
    net_salary_bdt: 40600,
    payout_channel: 'BKASH_NAGAD',
    disbursal_status: 'PROCESSED',
    disbursal_reference: 'MFS-BK-202602-19'
  }
];

// ==========================================
// 12. SALARY PAYMENT & DISBURSAL DATA
// ==========================================
export const INITIAL_DISBURSAL_BATCHES: DisbursalBatch[] = [
  {
    id: 'BAT-202602-BEFTN',
    batch_number: 'BATCH-BEFTN-202602-01',
    month: 'February 2026',
    channel: 'BEFTN',
    total_employees: 3,
    total_disbursed_bdt: 240200,
    processed_date: '2026-02-09',
    bank_source_account: 'City Bank Gulshan Branch (A/C #11029481)',
    status: 'SETTLED',
    auto_journal_posted: true
  },
  {
    id: 'BAT-202602-BKASH',
    batch_number: 'BATCH-BKASH-202602-02',
    month: 'February 2026',
    channel: 'BKASH_MFS',
    total_employees: 2,
    total_disbursed_bdt: 87200,
    processed_date: '2026-02-09',
    bank_source_account: 'bKash Corporate Escrow A/C #01700998811',
    status: 'SETTLED',
    auto_journal_posted: true
  }
];

// ==========================================
// 13. FINANCIAL ACCOUNTING & DOUBLE ENTRY DATA
// ==========================================
export const INITIAL_ACCOUNTS: ChartOfAccount[] = [
  { id: 1, account_code: '1010-CASH-DHAKA', account_name: 'Main Cash Account (Head Office Dhaka)', account_type: 'Asset', category: 'Current Asset', balance_bdt: 12500000 },
  { id: 2, account_code: '1020-BANK-CITY', account_name: 'City Bank Gulshan Corporate (A/C #11029481)', account_type: 'Asset', category: 'Current Asset', balance_bdt: 48500000 },
  { id: 3, account_code: '1030-BANK-DBBL', account_name: 'Dutch-Bangla Bank Principal Branch (A/C #110120)', account_type: 'Asset', category: 'Current Asset', balance_bdt: 32400000 },
  { id: 4, account_code: '1050-STORE-INVENTORY', account_name: 'Site Raw Material Store Inventory Asset', account_type: 'Asset', category: 'Current Asset', balance_bdt: 18400000 },
  { id: 5, account_code: '1110-SITE-ADVANCE-AGRO', account_name: 'Site Cash Advances & Agro Recoverable', account_type: 'Asset', category: 'Current Asset', balance_bdt: 2100000 },
  { id: 6, account_code: '2100-SUBCONTRACTOR-PAYABLE', account_name: 'Subcontractor Accounts Payable', account_type: 'Liability', category: 'Current Liability', balance_bdt: 6545000 },
  { id: 7, account_code: '2110-SUPPLIER-PAYABLE', account_name: 'Material Supplier Accounts Payable', account_type: 'Liability', category: 'Current Liability', balance_bdt: 16000000 },
  { id: 8, account_code: '2120-AIT-TAX-PAYABLE', account_name: 'AIT / TDS Tax Payable (NBR Challan Account)', account_type: 'Liability', category: 'Current Liability', balance_bdt: 385000 },
  { id: 9, account_code: '2130-VAT-MUSHAK-PAYABLE', account_name: 'VAT / Mushak 6.3 Tax Payable', account_type: 'Liability', category: 'Current Liability', balance_bdt: 520000 },
  { id: 10, account_code: '2150-RETENTION-MONEY', account_name: 'Subcontractor Retention Money Held (5-10%)', account_type: 'Liability', category: 'Current Liability', balance_bdt: 6650000 },
  { id: 11, account_code: '3010-SHARE-CAPITAL', account_name: 'Paid Up Equity Capital', account_type: 'Equity', category: 'Equity', balance_bdt: 150000000 },
  { id: 12, account_code: '4010-APARTMENT-SALES', account_name: 'Apartment & Commercial Booking Revenue', account_type: 'Revenue', category: 'Operating Revenue', balance_bdt: 385000000 },
  { id: 13, account_code: '5100-CIVIL-WORK', account_name: 'Direct Project Construction Civil & Structure Cost', account_type: 'Expense', category: 'Direct Cost', balance_bdt: 284000000 },
  { id: 14, account_code: '5200-SITE-SALARY-EXPENSE', account_name: 'Site Engineers & Staff Payroll Expense', account_type: 'Expense', category: 'Site Overhead', balance_bdt: 22400000 },
  { id: 15, account_code: '5300-SITE-HAZIRA-WAGE', account_name: 'Direct Site Labor Hazira Daily Wage Cost', account_type: 'Expense', category: 'Direct Cost', balance_bdt: 18900000 },
];

export const INITIAL_JOURNALS: GLJournal[] = [
  {
    id: 101,
    journal_number: 'JV-RA-20260201-881',
    journal_date: '2026-02-01',
    voucher_type: 'JOURNAL_VOUCHER',
    source_doc_type: 'RA_BILL',
    source_doc_id: 1,
    source_doc_ref: 'RA-BD-202602-1082',
    narration: 'Auto-Journal: RA Bill #RA-BD-202602-1082 Approved. Ref MB #MB-SITE-2026-881. Gross BDT 3,500,000.',
    total_debit: 3500000,
    total_credit: 3500000,
    posted_by: 'System Auto-Journal',
    lines: [
      { id: 1, account_code: '5100-CIVIL-WORK', account_name: 'Direct Project Construction Civil & Structure Cost', debit: 3500000, credit: 0, remarks: 'Gross Subcontractor Civil Work' },
      { id: 2, account_code: '2150-RETENTION-MONEY', account_name: 'Subcontractor Retention Money Held (5-10%)', debit: 0, credit: 350000, remarks: '10% Retention Withheld' },
      { id: 3, account_code: '2120-AIT-TAX-PAYABLE', account_name: 'AIT / TDS Tax Payable (NBR Challan Account)', debit: 0, credit: 175000, remarks: '5% AIT Tax Deducted at Source' },
      { id: 4, account_code: '2100-SUBCONTRACTOR-PAYABLE', account_name: 'Subcontractor Accounts Payable', debit: 0, credit: 2975000, remarks: 'Net Payable Amount' },
    ],
  },
  {
    id: 102,
    journal_number: 'JV-GRN-20260208-4912',
    journal_date: '2026-02-08',
    voucher_type: 'JOURNAL_VOUCHER',
    source_doc_type: 'GRN',
    source_doc_id: 1,
    source_doc_ref: 'GRN-SITE-20260208-4912',
    narration: 'Auto-Journal: GRN Verified for 25 Ton BSRM 500W Steel Rebar. PO #PO-BSRM-2026-018.',
    total_debit: 2450000,
    total_credit: 2450000,
    posted_by: 'System Auto-Journal',
    lines: [
      { id: 5, account_code: '1050-STORE-INVENTORY', account_name: 'Site Raw Material Store Inventory Asset', debit: 2450000, credit: 0, remarks: 'Stock Received at ৳ 98,000/Ton' },
      { id: 6, account_code: '2110-SUPPLIER-PAYABLE', account_name: 'Material Supplier Accounts Payable', debit: 0, credit: 2376500, remarks: 'Net Payable after 3% AIT' },
      { id: 7, account_code: '2120-AIT-TAX-PAYABLE', account_name: 'AIT / TDS Tax Payable (NBR Challan Account)', debit: 0, credit: 73500, remarks: '3% AIT on Material Purchase' },
    ]
  },
  {
    id: 103,
    journal_number: 'PV-DISB-202602-001',
    journal_date: '2026-02-09',
    voucher_type: 'PAYMENT_VOUCHER',
    source_doc_type: 'SALARY_PAYROLL',
    source_doc_id: 'BAT-202602-BEFTN',
    source_doc_ref: 'BATCH-BEFTN-202602-01',
    narration: 'Payment Voucher: February 2026 Site Staff BEFTN Bank Disbursal Settled.',
    total_debit: 262200,
    total_credit: 262200,
    posted_by: 'Arif Elahi, ACA',
    lines: [
      { id: 8, account_code: '5200-SITE-SALARY-EXPENSE', account_name: 'Site Engineers & Staff Payroll Expense', debit: 262200, credit: 0, remarks: 'Gross Earnings for 3 Engineers' },
      { id: 9, account_code: '1020-BANK-CITY', account_name: 'City Bank Gulshan Corporate (A/C #11029481)', debit: 0, credit: 240200, remarks: 'Net Bank Disbursal' },
      { id: 10, account_code: '1110-SITE-ADVANCE-AGRO', account_name: 'Site Cash Advances & Agro Recoverable', debit: 0, credit: 15000, remarks: 'Agro Advances Reconciled' },
      { id: 11, account_code: '2120-AIT-TAX-PAYABLE', account_name: 'AIT / TDS Tax Payable (NBR Challan Account)', debit: 0, credit: 7000, remarks: 'Salary TDS Withheld' }
    ]
  }
];

export const INITIAL_THREE_WAY_MATCHES: ThreeWayMatchVerification[] = [
  {
    id: '3WM-2026-001',
    vendor_id: 1,
    vendor_name: 'BSRM Steels Limited',
    po_number: 'PO-BSRM-2026-018',
    po_amount_bdt: 2450000,
    grn_number: 'GRN-SITE-20260208-4912',
    grn_accepted_value_bdt: 2450000,
    vendor_invoice_number: 'INV-BSRM-991204',
    invoice_amount_bdt: 2450000,
    variance_bdt: 0,
    match_status: 'PERFECT_MATCH',
    ap_release_status: 'APPROVED_FOR_PAYMENT'
  },
  {
    id: '3WM-2026-002',
    vendor_id: 2,
    vendor_name: 'Crown Cement PLC',
    po_number: 'PO-CRN-2026-012',
    po_amount_bdt: 324000,
    grn_number: 'GRN-SITE-20260204-4889',
    grn_accepted_value_bdt: 313200, // 20 bags rejected
    vendor_invoice_number: 'INV-CRN-884102',
    invoice_amount_bdt: 324000, // Supplier billed full
    variance_bdt: 10800, // 20 bags * 540
    match_status: 'MISMATCH_HOLD',
    ap_release_status: 'HELD'
  }
];

export const INITIAL_PDC_CHEQUES: PDCCheque[] = [
  {
    id: 1,
    cheque_number: 'CQ-7890124',
    bank_name: 'Dutch-Bangla Bank Ltd',
    party_type: 'Vendor',
    party_name: 'BSRM Steels Limited',
    cheque_date: '2026-02-15',
    amount_bdt: 2450000,
    cheque_type: 'Payment_Issued',
    status: 'Issued',
  },
  {
    id: 2,
    cheque_number: 'CQ-8810293',
    bank_name: 'City Bank PLC',
    party_type: 'Buyer',
    party_name: 'Engr. Tanvir Ahmed (Unit 402)',
    cheque_date: '2026-02-20',
    amount_bdt: 1500000,
    cheque_type: 'Receipt_Received',
    status: 'Deposited',
  },
  {
    id: 3,
    cheque_number: 'CQ-5510928',
    bank_name: 'Islami Bank Bangladesh Ltd',
    party_type: 'Subcontractor',
    party_name: 'Bengal Structure & Civil Engr',
    cheque_date: '2026-01-28',
    amount_bdt: 2975000,
    cheque_type: 'Payment_Issued',
    status: 'Cleared',
    clearance_date: '2026-01-30',
  },
];

// ==========================================
// 14. STATISTICAL & ANALYTICAL REPORTS DATA
// ==========================================
export const INITIAL_COST_VARIANCES: ProjectCostVariance[] = [
  { sub_project_name: 'Tower A (14-Storey)', boq_category: 'Civil Rebar & Steel', budget_bdt: 44100000, actual_spent_bdt: 28420000, variance_bdt: -15680000, variance_pct: -35.5, status: 'ON_TRACK' },
  { sub_project_name: 'Tower A (14-Storey)', boq_category: 'Cement Binders', budget_bdt: 15120000, actual_spent_bdt: 9990000, variance_bdt: -5130000, variance_pct: -33.9, status: 'ON_TRACK' },
  { sub_project_name: 'Tower A (14-Storey)', boq_category: 'Bricks & Masonry', budget_bdt: 9425000, actual_spent_bdt: 6090000, variance_bdt: -3335000, variance_pct: -35.3, status: 'ON_TRACK' },
  { sub_project_name: 'Basement & Retaining', boq_category: 'Deep Piling & Excavation', budget_bdt: 120000000, actual_spent_bdt: 118500000, variance_bdt: -1500000, variance_pct: -1.2, status: 'ON_TRACK' },
  { sub_project_name: 'Podium Commercial', boq_category: 'Structural Casting', budget_bdt: 85000000, actual_spent_bdt: 24500000, variance_bdt: -60500000, variance_pct: -71.1, status: 'ON_TRACK' },
];

export const INITIAL_AGING_BUCKETS: AgingBucket[] = [
  { party_name: 'BSRM Steels Limited', party_type: 'Supplier', total_due_bdt: 12500000, days_0_30: 2450000, days_31_60: 6200000, days_61_90: 3850000, days_90_plus: 0 },
  { party_name: 'Crown Cement PLC', party_type: 'Supplier', total_due_bdt: 3500000, days_0_30: 313200, days_31_60: 1800000, days_61_90: 1386800, days_90_plus: 0 },
  { party_name: 'Bengal Structure & Civil Engr', party_type: 'Subcontractor', total_due_bdt: 2930000, days_0_30: 2930000, days_31_60: 0, days_61_90: 0, days_90_plus: 0 },
  { party_name: 'Padma Shuttering Works', party_type: 'Subcontractor', total_due_bdt: 1550000, days_0_30: 1550000, days_31_60: 0, days_61_90: 0, days_90_plus: 0 },
  { party_name: 'Dr. Nusrat Jahan Shah (Apt 4B)', party_type: 'Apartment Buyer', total_due_bdt: 4500000, days_0_30: 0, days_31_60: 4500000, days_61_90: 0, days_90_plus: 0 },
];

export const INITIAL_WASTAGE_ANALYTICS: MaterialConsumptionWastage[] = [
  { item_code: 'CIV-RBR-16MM', item_name: '16mm TMT Steel Rebar (BSRM 500W)', unit: 'Ton', boq_estimated_qty: 285.0, actual_issued_qty: 290.0, wastage_qty: 5.0, wastage_pct: 1.75, allowable_limit_pct: 2.50, status: 'NORMAL' },
  { item_code: 'CIV-CMT-PCC', item_name: 'Crown PCC Cement Bags', unit: 'Bags', boq_estimated_qty: 18000, actual_issued_qty: 18500, wastage_qty: 500, wastage_pct: 2.77, allowable_limit_pct: 2.00, status: 'EXCESSIVE_WASTAGE' },
  { item_code: 'CIV-BRK-AUTO', item_name: '1st Class Auto Bricks', unit: 'Nos', boq_estimated_qty: 405000, actual_issued_qty: 420000, wastage_qty: 15000, wastage_pct: 3.70, allowable_limit_pct: 5.00, status: 'NORMAL' },
  { item_code: 'CIV-SND-SYL', item_name: 'Sylhet Coarse Sand (FM 2.5)', unit: 'CFT', boq_estimated_qty: 80000, actual_issued_qty: 82000, wastage_qty: 2000, wastage_pct: 2.50, allowable_limit_pct: 4.00, status: 'NORMAL' },
];

// Existing Tower, Units & DPR data
export const INITIAL_TOWERS: Tower[] = [
  { id: 1, project_id: 1, tower_name: 'Tower A - North Wing', total_floors: 14 },
  { id: 2, project_id: 1, tower_name: 'Tower B - South Wing', total_floors: 14 },
  { id: 3, project_id: 2, tower_name: 'Main Executive Tower', total_floors: 16 },
];

export const INITIAL_UNITS: Unit[] = Array.from({ length: 48 }).map((_, idx) => {
  const floorNum = Math.floor(idx / 4) + 1;
  const unitLetter = String.fromCharCode(65 + (idx % 4)); // A, B, C, D
  const unitNum = `${floorNum}0${(idx % 4) + 1}-${unitLetter}`;
  const isUpperFloor = floorNum > 8;
  const sqft = isUpperFloor ? 2450 : 2100;
  const ratePerSqft = floorNum > 6 ? 9800 : 8800; // BDT per sqft
  const parkingPrice = 500000;
  const totalPrice = sqft * ratePerSqft + parkingPrice;

  let status: Unit['status'] = 'Available';
  let buyerName: string | undefined;
  let buyerPhone: string | undefined;
  let buyerNid: string | undefined;
  let bookingDate: string | undefined;

  if (idx % 5 === 0) {
    status = 'Booked';
    buyerName = idx % 2 === 0 ? 'Md. Rafiqul Islam' : 'Engr. Tanvir Ahmed';
    buyerPhone = '+880 1711-894210';
    buyerNid = '19882691204910';
    bookingDate = '2025-11-12';
  } else if (idx % 3 === 0) {
    status = 'Sold';
    buyerName = 'Dr. Nusrat Jahan Shah';
    buyerPhone = '+880 1819-402918';
    buyerNid = '19922610294812';
    bookingDate = '2025-04-05';
  } else if (idx % 11 === 0) {
    status = 'HandedOver';
    buyerName = 'Alhaj Mustafizur Rahman';
    buyerPhone = '+880 1912-304910';
    buyerNid = '19752601928312';
    bookingDate = '2024-02-18';
  }

  return {
    id: idx + 1,
    project_id: 1,
    tower_id: (idx % 2) + 1,
    floor_id: floorNum,
    floor_number: floorNum,
    unit_number: unitNum,
    unit_type: isUpperFloor ? 'Residential 4BR' : 'Residential 3BR',
    size_sqft: sqft,
    rate_per_sqft_bdt: ratePerSqft,
    parking_price_bdt: parkingPrice,
    total_price_bdt: totalPrice,
    status,
    buyer_name: buyerName,
    buyer_phone: buyerPhone,
    buyer_nid: buyerNid,
    booking_date: bookingDate,
  };
});

export const INITIAL_DPR: DailyProgressReport[] = [
  {
    id: 1,
    project_id: 1,
    project_name: 'Purbachal Green City Tower A',
    dpr_date: '2026-02-09',
    weather_condition: 'Sunny & Clear (28°C)',
    site_engineer_name: 'Engr. Kamrul Hasan',
    mason_count: 18,
    rod_binder_count: 24,
    carpenter_count: 12,
    electrician_count: 6,
    helper_count: 32,
    execution_summary: 'Completed 9th floor slab reinforcement binding and conduit fitting. Tower B basement water proofing plaster in progress.',
    store_issues_summary: 'Issued 8.5 Ton Rebar & 140 Cement Bags for Column Casting.',
    site_photo_urls: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
    ],
    status: 'Verified',
  },
];
