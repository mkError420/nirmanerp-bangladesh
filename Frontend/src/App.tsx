import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardOverview } from './pages/DashboardOverview';

// 14 Business Modules
import { DepartmentalWorkflow } from './pages/DepartmentalWorkflow';
import { RBACAuditLogs } from './pages/RBACAuditLogs';
import { SuppliersContractors } from './pages/SuppliersContractors';
import { SubProjectGantt } from './pages/SubProjectGantt';
import { SubcontractingBOQ } from './pages/SubcontractingBOQ';
import { DocumentLibrary } from './pages/DocumentLibrary';
import { ProductCatalog } from './pages/ProductCatalog';
import { PurchaseOrderEngine } from './pages/PurchaseOrderEngine';
import { StoreInventoryGRN } from './pages/StoreInventoryGRN';
import { EmployeeHRHazira } from './pages/EmployeeHRHazira';
import { SalarySheetGenerator } from './pages/SalarySheetGenerator';
import { SalaryDisbursal } from './pages/SalaryDisbursal';
import { FinancialDoubleEntry } from './pages/FinancialDoubleEntry';
import { AnalyticalReports } from './pages/AnalyticalReports';

// Existing Modules
import { UnitInventoryMatrix } from './pages/UnitInventoryMatrix';
import { SiteDPRMobile } from './pages/SiteDPRMobile';
import { TaxComplianceBD } from './pages/TaxComplianceBD';
import { PHPBackendCodeViewer } from './pages/PHPBackendCodeViewer';
import { Login } from './pages/Login';

import {
  INITIAL_PROJECTS,
  INITIAL_SUB_PROJECTS,
  INITIAL_MILESTONES,
  INITIAL_STAFF_ALLOCATIONS,
  INITIAL_WORKFLOW_STAGES,
  INITIAL_STAGE_GATE_APPROVALS,
  INITIAL_DEPARTMENT_ALERTS,
  INITIAL_SYSTEM_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_VENDORS,
  INITIAL_COMPLIANCE_DOCS,
  INITIAL_BOQ_ITEMS,
  INITIAL_WORK_ORDERS,
  INITIAL_RA_BILLS,
  INITIAL_DOCUMENT_FILES,
  INITIAL_PRODUCT_GROUPS,
  INITIAL_PRODUCT_SUB_GROUPS,
  INITIAL_CATALOG_ITEMS,
  INITIAL_PR,
  INITIAL_PO,
  INITIAL_GRN,
  INITIAL_GATE_PASSES,
  INITIAL_STORE_ISSUE_VOUCHERS,
  INITIAL_STOCK_TRANSFERS,
  INITIAL_STOCK_LEDGER,
  INITIAL_EMPLOYEES,
  INITIAL_HAZIRA_LOGS,
  INITIAL_PAYROLL_RECORDS,
  INITIAL_DISBURSAL_BATCHES,
  INITIAL_ACCOUNTS,
  INITIAL_JOURNALS,
  INITIAL_THREE_WAY_MATCHES,
  INITIAL_PDC_CHEQUES,
  INITIAL_COST_VARIANCES,
  INITIAL_AGING_BUCKETS,
  INITIAL_WASTAGE_ANALYTICS,
  INITIAL_UNITS,
  INITIAL_DPR
} from './data/initialData';

import {
  Project,
  SubProject,
  ProjectMilestone,
  SiteStaffAllocation,
  WorkflowStage,
  StageGateApproval,
  DepartmentAlert,
  SystemUser,
  AuditLogEntry,
  Vendor,
  ComplianceDoc,
  BOQItem,
  WorkOrder,
  RABill,
  DocumentFile,
  ProductGroup,
  ProductSubGroup,
  CatalogItem,
  PurchaseRequisition,
  PurchaseOrder,
  GRN,
  GatePassLog,
  StoreIssueVoucher,
  StockTransfer,
  StockLedgerItem,
  Employee,
  DailyWageHaziraLog,
  MonthlyPayrollRecord,
  DisbursalBatch,
  ChartOfAccount,
  GLJournal,
  ThreeWayMatchVerification,
  PDCCheque,
  ProjectCostVariance,
  AgingBucket,
  MaterialConsumptionWastage,
  Unit,
  DailyProgressReport,
  DepartmentCode,
  POLifecycleStatus,
  PDCStatus
} from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');

  // Multi-user & Active Profile
  const [currentUser, setCurrentUser] = useState<SystemUser>(INITIAL_SYSTEM_USERS[0]);
  const [systemUsers] = useState<SystemUser[]>(INITIAL_SYSTEM_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Projects & Hierarchy
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project>(INITIAL_PROJECTS[0]);
  const [subProjects] = useState<SubProject[]>(INITIAL_SUB_PROJECTS);
  const [milestones] = useState<ProjectMilestone[]>(INITIAL_MILESTONES);
  const [staffAllocations] = useState<SiteStaffAllocation[]>(INITIAL_STAFF_ALLOCATIONS);

  // Departmental Workflow & Approvals
  const [workflowStages] = useState<WorkflowStage[]>(INITIAL_WORKFLOW_STAGES);
  const [stageGateApprovals, setStageGateApprovals] = useState<StageGateApproval[]>(INITIAL_STAGE_GATE_APPROVALS);
  const [departmentAlerts, setDepartmentAlerts] = useState<DepartmentAlert[]>(INITIAL_DEPARTMENT_ALERTS);

  // Suppliers & Subcontractors
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [complianceDocs] = useState<ComplianceDoc[]>(INITIAL_COMPLIANCE_DOCS);

  // BoQ & Work Orders
  const [boqItems, setBoqItems] = useState<BOQItem[]>(INITIAL_BOQ_ITEMS);
  const [workOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [raBills, setRaBills] = useState<RABill[]>(INITIAL_RA_BILLS);

  // Documents
  const [documentFiles] = useState<DocumentFile[]>(INITIAL_DOCUMENT_FILES);

  // Catalog
  const [productGroups] = useState<ProductGroup[]>(INITIAL_PRODUCT_GROUPS);
  const [productSubGroups] = useState<ProductSubGroup[]>(INITIAL_PRODUCT_SUB_GROUPS);
  const [catalogItems] = useState<CatalogItem[]>(INITIAL_CATALOG_ITEMS);

  // Procurement & Orders
  const [purchaseRequisitions, setPurchaseRequisitions] = useState<PurchaseRequisition[]>(INITIAL_PR);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PO);

  // Store & Inventory
  const [grns, setGrns] = useState<GRN[]>(INITIAL_GRN);
  const [gatePasses] = useState<GatePassLog[]>(INITIAL_GATE_PASSES);
  const [issueVouchers] = useState<StoreIssueVoucher[]>(INITIAL_STORE_ISSUE_VOUCHERS);
  const [stockTransfers] = useState<StockTransfer[]>(INITIAL_STOCK_TRANSFERS);
  const [stockLedger, setStockLedger] = useState<StockLedgerItem[]>(INITIAL_STOCK_LEDGER);

  // HR & Payroll
  const [employees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [haziraLogs] = useState<DailyWageHaziraLog[]>(INITIAL_HAZIRA_LOGS);
  const [payrollRecords] = useState<MonthlyPayrollRecord[]>(INITIAL_PAYROLL_RECORDS);
  const [disbursalBatches] = useState<DisbursalBatch[]>(INITIAL_DISBURSAL_BATCHES);

  // Accounting & GL
  const [accounts] = useState<ChartOfAccount[]>(INITIAL_ACCOUNTS);
  const [journals, setJournals] = useState<GLJournal[]>(INITIAL_JOURNALS);
  const [threeWayMatches] = useState<ThreeWayMatchVerification[]>(INITIAL_THREE_WAY_MATCHES);
  const [pdcCheques, setPdcCheques] = useState<PDCCheque[]>(INITIAL_PDC_CHEQUES);

  // Reports
  const [costVariances] = useState<ProjectCostVariance[]>(INITIAL_COST_VARIANCES);
  const [agingBuckets] = useState<AgingBucket[]>(INITIAL_AGING_BUCKETS);
  const [wastageAnalytics] = useState<MaterialConsumptionWastage[]>(INITIAL_WASTAGE_ANALYTICS);

  // Units & DPR
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [dprs, setDprs] = useState<DailyProgressReport[]>(INITIAL_DPR);

  // Check auth
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  // Switch User Role
  const handleSwitchUserRole = (usr: SystemUser) => {
    setCurrentUser(usr);
    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: usr.id,
      userName: usr.name,
      userRole: usr.role,
      department: usr.department,
      action: 'LOGIN',
      entity: 'USER_SESSION',
      entityId: usr.id,
      ipAddress: '103.145.112.45',
      updatedValue: `Switched active profile to ${usr.name} (${usr.role})`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Stage-Gate Approval Handlers
  const handleApproveStageGate = (approvalId: string, comment: string) => {
    setStageGateApprovals(prev => prev.filter(a => a.id !== approvalId));

    const newAlert: DepartmentAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      sourceDept: currentUser.department,
      targetDept: 'ACCOUNTS',
      title: `Stage-Gate Approved: ${approvalId}`,
      message: `Document ${approvalId} authorized by ${currentUser.name}. Forwarded to Accounts for financial release.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      documentRef: approvalId,
      isRead: false,
      channel: 'BOTH',
      smsDelivered: true
    };
    setDepartmentAlerts(prev => [newAlert, ...prev]);

    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      department: currentUser.department,
      action: 'APPROVE',
      entity: 'STAGE_GATE_APPROVAL',
      entityId: approvalId,
      ipAddress: '103.145.112.45',
      previousValue: 'Status: Pending',
      updatedValue: `Status: Approved | Note: ${comment}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleRejectStageGate = (approvalId: string, comment: string) => {
    setStageGateApprovals(prev => prev.filter(a => a.id !== approvalId));
  };

  // Automated Data Handoff Simulator
  const handleTriggerHandoff = (type: 'PO_TO_GRN' | 'GRN_TO_COST' | 'RA_TO_FINANCE') => {
    if (type === 'PO_TO_GRN') {
      const newGRN: GRN = {
        id: grns.length + 1,
        grn_number: `GRN-SITE-${Date.now().toString().slice(-6)}`,
        po_id: 1,
        po_number: 'PO-BSRM-2026-018',
        project_id: selectedProject.id,
        project_name: selectedProject.project_name,
        vendor_id: 1,
        vendor_name: 'BSRM Steels Limited',
        received_date: new Date().toISOString().split('T')[0],
        chalan_number: 'BSRM-CHALAN-99201',
        vehicle_no: 'Dhaka Metro-TA-11-9284',
        driver_name: 'Md. Rustam Ali',
        driver_contact: '+880 1718-992019',
        site_store_keeper: 'Md. Dulal Hossain',
        status: 'Stock Updated',
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
      };
      setGrns(prev => [newGRN, ...prev]);
      setStockLedger(prev =>
        prev.map(s => s.item_code === 'CIV-RBR-16MM' ? { ...s, current_balance: s.current_balance + 25 } : s)
      );

      const alert: DepartmentAlert = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        sourceDept: 'PURCHASE',
        targetDept: 'STORE',
        title: 'Auto Data Handoff: PO → Store GRN Auto-Created',
        message: 'GRN pre-filled with 25 Ton BSRM Rebar items and stock updated automatically.',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        documentRef: newGRN.grn_number,
        isRead: false,
        channel: 'BOTH',
        smsDelivered: true
      };
      setDepartmentAlerts(prev => [alert, ...prev]);
    }
  };

  const handleSendSmsAlert = (targetDept: DepartmentCode, message: string) => {
    const alert: DepartmentAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      sourceDept: currentUser.department,
      targetDept,
      title: `SMS Broadcast from ${currentUser.name}`,
      message,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      documentRef: 'BROADCAST',
      isRead: false,
      channel: 'SMS',
      smsDelivered: true
    };
    setDepartmentAlerts(prev => [alert, ...prev]);
  };

  // RA Bill Approval & Auto GL Journal
  const handleApproveRABill = (billData: any) => {
    const gross = billData.gross_amount;
    const retention = billData.retention_amount;
    const ait = billData.ait_amount;
    const net = billData.net_payable;
    const billNo = `RA-BD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBill: RABill = {
      id: raBills.length + 1,
      bill_number: billNo,
      project_id: billData.project_id,
      project_name: selectedProject.project_name,
      sub_project_name: billData.sub_project_name,
      vendor_id: billData.vendor_id,
      subcontractor_name: billData.subcontractor_name,
      mb_number: billData.mb_number,
      bill_date: new Date().toISOString().split('T')[0],
      work_description: billData.work_description,
      gross_amount: gross,
      retention_rate_pct: billData.retention_rate_pct,
      retention_amount: retention,
      cash_advance_recovery_bdt: billData.cash_advance_recovery_bdt || 0,
      material_backcharge_bdt: billData.material_backcharge_bdt || 0,
      ait_rate_pct: billData.ait_rate_pct,
      ait_amount: ait,
      vat_rate_pct: 0,
      vat_amount: 0,
      other_deductions: 0,
      net_payable: net,
      status: 'Approved',
      approved_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setRaBills(prev => [newBill, ...prev]);

    // Auto Journal Posting
    const newJournal: GLJournal = {
      id: journals.length + 101,
      journal_number: `JV-RA-${Date.now().toString().slice(-6)}`,
      journal_date: new Date().toISOString().split('T')[0],
      voucher_type: 'JOURNAL_VOUCHER',
      source_doc_type: 'RA_BILL',
      source_doc_id: newBill.id,
      source_doc_ref: newBill.bill_number,
      narration: `Auto-Journal: RA Bill #${newBill.bill_number} Approved for ${newBill.subcontractor_name}. Gross BDT ${gross.toLocaleString()}.`,
      total_debit: gross,
      total_credit: gross,
      posted_by: 'System Auto-Journal',
      lines: [
        { id: 1, account_code: '5100-CIVIL-WORK', account_name: 'Direct Project Construction Civil & Structure Cost', debit: gross, credit: 0, remarks: 'Subcontractor Civil Claim' },
        { id: 2, account_code: '2150-RETENTION-MONEY', account_name: 'Subcontractor Retention Money Held (5-10%)', debit: 0, credit: retention, remarks: `${newBill.retention_rate_pct}% Retention Withheld` },
        { id: 3, account_code: '2120-AIT-TAX-PAYABLE', account_name: 'AIT / TDS Tax Payable (NBR Challan Account)', debit: 0, credit: ait, remarks: '5% AIT at Source' },
        { id: 4, account_code: '2100-SUBCONTRACTOR-PAYABLE', account_name: 'Subcontractor Accounts Payable', debit: 0, credit: net, remarks: 'Net Payable Amount' },
      ]
    };
    setJournals(prev => [newJournal, ...prev]);
  };

  // Convert PR to PO
  const handleConvertPRToPO = (prId: number, vendorId: number) => {
    const pr = purchaseRequisitions.find(p => p.id === prId);
    if (!pr) return;

    const newPO: PurchaseOrder = {
      id: purchaseOrders.length + 1,
      po_number: `PO-AUTO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      pr_id: pr.id,
      pr_number: pr.pr_number,
      project_id: selectedProject.id,
      project_name: selectedProject.project_name,
      vendor_id: 1,
      vendor_name: 'BSRM Steels Limited',
      po_date: new Date().toISOString().split('T')[0],
      delivery_deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      delivery_site_store: pr.delivery_site,
      payment_terms: '30 Days Net from GRN Verification',
      items: pr.items.map((it, idx) => ({
        id: idx + 1,
        item_code: it.item_code,
        item_name: it.item_name,
        spec: 'Standard Specification',
        qty: it.req_qty,
        unit: it.unit,
        unit_rate_bdt: it.estimated_rate_bdt || 98000,
        total_bdt: it.req_qty * (it.estimated_rate_bdt || 98000),
        received_qty: 0
      })),
      subtotal_bdt: 2450000,
      vat_rate_pct: 0,
      vat_amount_bdt: 0,
      ait_rate_pct: 3,
      ait_amount_bdt: 73500,
      grand_total_bdt: 2450000,
      status: 'Approved',
      approved_by: currentUser.name,
      approval_date: new Date().toISOString().split('T')[0]
    };

    setPurchaseOrders(prev => [newPO, ...prev]);
    setPurchaseRequisitions(prev => prev.map(p => p.id === prId ? { ...p, status: 'PO Created' } : p));
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      projects={projects}
      selectedProject={selectedProject}
      setSelectedProject={setSelectedProject}
      currentUser={currentUser}
      alerts={departmentAlerts}
      pendingApprovalsCount={stageGateApprovals.length}
      onLogout={handleLogout}
    >
      {/* 0. Executive Overview */}
      {currentTab === 'overview' && (
        <DashboardOverview
          project={selectedProject}
          units={units}
          raBills={raBills}
          boqItems={boqItems}
          pdcCheques={pdcCheques}
          pendingApprovalsCount={stageGateApprovals.length}
          activeAlertsCount={departmentAlerts.length}
          onNavigate={(tab) => setCurrentTab(tab)}
        />
      )}

      {/* 1. Departmental Workflow Management */}
      {currentTab === 'workflow' && (
        <DepartmentalWorkflow
          stages={workflowStages}
          approvals={stageGateApprovals}
          alerts={departmentAlerts}
          onApproveNode={handleApproveStageGate}
          onRejectNode={handleRejectStageGate}
          onTriggerHandoff={handleTriggerHandoff}
          onSendSmsAlert={handleSendSmsAlert}
        />
      )}

      {/* 2. Multi-User RBAC & Audit Trail */}
      {currentTab === 'rbac' && (
        <RBACAuditLogs
          users={systemUsers}
          auditLogs={auditLogs}
          currentUser={currentUser}
          onSwitchUserRole={handleSwitchUserRole}
        />
      )}

      {/* 3. Supplier & Contractor Management */}
      {currentTab === 'suppliers' && (
        <SuppliersContractors
          vendors={vendors}
          complianceDocs={complianceDocs}
        />
      )}

      {/* 4. Sub-Project Management & Hierarchy */}
      {currentTab === 'subproject-gantt' && (
        <SubProjectGantt
          project={selectedProject}
          subProjects={subProjects}
          milestones={milestones}
          staffAllocations={staffAllocations}
        />
      )}

      {/* 5. Subcontracting & Master BoQ */}
      {currentTab === 'subcontracting-boq' && (
        <SubcontractingBOQ
          project={selectedProject}
          boqItems={boqItems}
          workOrders={workOrders}
          raBills={raBills}
          vendors={vendors}
          onApproveRABill={handleApproveRABill}
        />
      )}

      {/* 6. Document Library & Version Control */}
      {currentTab === 'doc-library' && (
        <DocumentLibrary
          documents={documentFiles}
        />
      )}

      {/* 7. Product Catalog & Grouping */}
      {currentTab === 'product-catalog' && (
        <ProductCatalog
          groups={productGroups}
          subGroups={productSubGroups}
          items={catalogItems}
        />
      )}

      {/* 8. Purchase Order (PO) Engine */}
      {currentTab === 'po-engine' && (
        <PurchaseOrderEngine
          requisitions={purchaseRequisitions}
          purchaseOrders={purchaseOrders}
          vendors={vendors}
          catalogItems={catalogItems}
          onConvertPRToPO={handleConvertPRToPO}
          onUpdatePOStatus={(poId, status) => {
            setPurchaseOrders(prev => prev.map(p => p.id === poId ? { ...p, status } : p));
          }}
        />
      )}

      {/* 9. Store & Inventory Management (GRN) */}
      {currentTab === 'store-grn' && (
        <StoreInventoryGRN
          project={selectedProject}
          grns={grns}
          gatePasses={gatePasses}
          issueVouchers={issueVouchers}
          stockTransfers={stockTransfers}
          stockLedger={stockLedger}
          vendors={vendors}
          onAddGRN={(newGRN) => setGrns(prev => [newGRN, ...prev])}
        />
      )}

      {/* 10. Employee Profile & HR Management (Hazira) */}
      {currentTab === 'employee-hr' && (
        <EmployeeHRHazira
          employees={employees}
          haziraLogs={haziraLogs}
        />
      )}

      {/* 11. Printable Salary Sheet Generator */}
      {currentTab === 'salary-sheet' && (
        <SalarySheetGenerator
          payrollRecords={payrollRecords}
        />
      )}

      {/* 12. Salary Payment & Disbursal */}
      {currentTab === 'salary-disbursal' && (
        <SalaryDisbursal
          batches={disbursalBatches}
          payrollRecords={payrollRecords}
        />
      )}

      {/* 13. Financial Accounting System (Double-Entry Engine) */}
      {currentTab === 'financial-accounts' && (
        <FinancialDoubleEntry
          accounts={accounts}
          journals={journals}
          threeWayMatches={threeWayMatches}
          pdcCheques={pdcCheques}
          onUpdatePdcStatus={(pdcId, status) => {
            setPdcCheques(prev => prev.map(p => p.id === pdcId ? { ...p, status } : p));
          }}
        />
      )}

      {/* 14. Statistical & Analytical Reports */}
      {currentTab === 'analytical-reports' && (
        <AnalyticalReports
          accounts={accounts}
          costVariances={costVariances}
          agingBuckets={agingBuckets}
          wastageAnalytics={wastageAnalytics}
        />
      )}

      {/* Existing Modules */}
      {currentTab === 'units' && (
        <UnitInventoryMatrix
          project={selectedProject}
          units={units}
          onBookUnit={(unitId, buyerName, buyerPhone, buyerNid) => {
            setUnits(prev => prev.map(u => u.id === unitId ? {
              ...u, status: 'Booked', buyer_name: buyerName, buyer_phone: buyerPhone, buyer_nid: buyerNid, booking_date: new Date().toISOString().split('T')[0]
            } : u));
          }}
        />
      )}

      {currentTab === 'dpr' && (
        <SiteDPRMobile
          project={selectedProject}
          dprs={dprs}
          onSubmitDpr={(newDpr) => setDprs(prev => [{ ...newDpr, id: prev.length + 1 }, ...prev])}
        />
      )}

      {currentTab === 'tax-ait' && <TaxComplianceBD />}
      {currentTab === 'php-code' && <PHPBackendCodeViewer />}
    </DashboardLayout>
  );
}
