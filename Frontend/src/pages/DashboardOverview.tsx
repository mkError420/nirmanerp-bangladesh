import React, { useState } from 'react';
import {
  Project,
  RABill,
  Unit,
  PDCCheque,
  BOQItem
} from '../types';
import { formatBDT, formatCompactBDT } from '../utils/financial';

interface DashboardOverviewProps {
  project: Project;
  units: Unit[];
  raBills: RABill[];
  boqItems: BOQItem[];
  pdcCheques: PDCCheque[];
  pendingApprovalsCount: number;
  activeAlertsCount: number;
  onNavigate: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  project,
  units,
  raBills,
  boqItems,
  pdcCheques,
  pendingApprovalsCount,
  activeAlertsCount,
  onNavigate,
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');
  const [moduleSearch, setModuleSearch] = useState('');

  const totalRetentionHeld = raBills.reduce((acc, b) => acc + b.retention_amount, 0);
  const totalAitHeld = raBills.reduce((acc, b) => acc + b.ait_amount, 0);
  const budgetUsagePct = Math.min(100, Math.round((project.spent_bdt / project.estimated_budget_bdt) * 100));

  const allModules = [
    { id: 'workflow', category: 'EXECUTIVE', label: 'Stage-Gate Approvals', symbol: '⚡', desc: 'Departmental approval chain & digital sign-off gates' },
    { id: 'analytical-reports', category: 'EXECUTIVE', label: 'P&L & Analytics', symbol: '📈', desc: 'Real-time Balance Sheet, P&L and Cost Variance' },
    { id: 'subproject-gantt', category: 'CIVIL', label: 'CPM Gantt & Schedules', symbol: '📅', desc: 'CPM Critical Path, Tower/Basement milestones & staff allocations' },
    { id: 'subcontracting-boq', category: 'CIVIL', label: 'Subcontracting & Master BoQ', symbol: '📐', desc: 'Master BoQ (CFT/SFT/Ton), Work Orders & RA Bill Deductions' },
    { id: 'dpr', category: 'CIVIL', label: 'Site Daily Progress (DPR)', symbol: '🚧', desc: 'Site photos, weather logs, daily output & issue tracking' },
    { id: 'doc-library', category: 'CIVIL', label: 'Document & CAD Library', symbol: '📁', desc: 'Version controlled structural CAD (.dwg) & approval files' },
    { id: 'units', category: 'CIVIL', label: 'Unit Inventory Matrix', symbol: '🏢', desc: 'Real estate apartment inventory & booking statuses' },
    { id: 'po-engine', category: 'PROCUREMENT', label: 'Purchase Orders (PO Engine)', symbol: '🛒', desc: 'PR requisition, 6-stage PO lifecycle and PDF generation' },
    { id: 'store-grn', category: 'PROCUREMENT', label: 'Site Store & GRN', symbol: '🏬', desc: 'Goods Receipt Note inspection, Gate Passes & stock ledger' },
    { id: 'product-catalog', category: 'PROCUREMENT', label: 'Material Catalog & Rates', symbol: '🏷️', desc: 'Material Master, Reorder Points & Regional Price Matrix' },
    { id: 'suppliers', category: 'PROCUREMENT', label: 'Vendors & Subcontractors', symbol: '🚚', desc: 'Partner Ledgers, Specializations & Compliance Tracking' },
    { id: 'employee-hr', category: 'HR', label: 'Employee HR & Daily Hazira', symbol: '👷', desc: 'NID database, biometric sync & daily labor wage engine' },
    { id: 'salary-sheet', category: 'HR', label: 'Monthly Salary Sheets', symbol: '📑', desc: 'Monthly Payroll formula with auto tax & sign-offs' },
    { id: 'salary-disbursal', category: 'HR', label: 'BEFTN & MFS Disbursal', symbol: '💳', desc: 'Bangladesh Bank BEFTN batch files & bKash payouts' },
    { id: 'financial-accounts', category: 'FINANCE', label: 'Double-Entry GL Ledger', symbol: '📒', desc: 'Construction Chart of Accounts & 3-Way Matching Engine' },
    { id: 'tax-ait', category: 'FINANCE', label: 'NBR Tax & AIT Compliance', symbol: '🏛️', desc: 'NBR Income Tax Act 2023 5% AIT & TDS compliance' },
    { id: 'rbac', category: 'ADMIN', label: 'RBAC & Audit Trail', symbol: '🛡️', desc: 'Field-level isolation & immutable system audit logs' },
  ];

  const filteredModules = allModules.filter(m => {
    const matchesCat = activeCategoryFilter === 'ALL' || m.category === activeCategoryFilter;
    const matchesSearch = !moduleSearch || m.label.toLowerCase().includes(moduleSearch.toLowerCase()) || m.desc.toLowerCase().includes(moduleSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#0b162c] to-blue-950 p-6 lg:p-7 text-white shadow-lg border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-semibold border border-blue-500/30">
                {project.project_code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                {project.status}
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline">•</span>
              <span className="text-slate-400 text-xs">Cost Center Master</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">{project.project_name}</h1>
            
            <p className="text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span><strong>Location:</strong> {project.location}</span>
              <span>•</span>
              <span><strong>Land Area:</strong> {project.total_land_katha} Katha</span>
              <span>•</span>
              <span><strong>Target Completion:</strong> {project.target_completion_date}</span>
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('workflow')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-sm cursor-pointer"
            >
              <span>⚡ Stage-Gate Approvals</span>
              {pendingApprovalsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-blue-700 text-[10px] font-bold flex items-center justify-center font-mono">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('analytical-reports')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <span>📈 P&L Statement</span>
            </button>

            <button
              onClick={() => onNavigate('dpr')}
              className="px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Daily Progress Report"
            >
              <span>🚧 DPR</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Budget & Cost Incurred */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Allocated Budget</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              ৳
            </div>
          </div>
          
          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            {formatCompactBDT(project.spent_bdt)}
          </div>

          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Budget Utilized</span>
              <span className="font-semibold text-slate-700 font-mono">{budgetUsagePct}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  budgetUsagePct > 90 ? 'bg-rose-500' : budgetUsagePct > 75 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${budgetUsagePct}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 font-mono pt-0.5 flex justify-between">
              <span>Total Cap:</span>
              <span className="font-semibold text-slate-700">{formatCompactBDT(project.estimated_budget_bdt)}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Subcontractor Retention Fund */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Retention Fund (10%)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              🛡️
            </div>
          </div>

          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            {formatCompactBDT(totalRetentionHeld)}
          </div>

          <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2.5 space-y-1">
            <div className="flex justify-between">
              <span>Defect Liability:</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Active</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>AIT 5% Withheld:</span>
              <span className="font-semibold text-slate-700">{formatCompactBDT(totalAitHeld)}</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Stage-Gate Approvals Queue */}
        <div 
          onClick={() => onNavigate('workflow')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Approvals In Queue</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
              ⚡
            </div>
          </div>

          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight flex items-baseline gap-2">
            <span>{pendingApprovalsCount}</span>
            <span className="text-xs font-normal text-slate-500 font-sans">Pending Sign-off</span>
          </div>

          <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2.5 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Awaiting Site & Finance</span>
            <span className="text-blue-600 font-semibold text-xs font-mono">Review →</span>
          </div>
        </div>

        {/* KPI 4: PDC Maturing Cheques */}
        <div 
          onClick={() => onNavigate('analytical-reports')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-purple-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Maturing PDC Cheques</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              🕒
            </div>
          </div>

          <div className="text-2xl font-bold text-purple-900 font-mono tracking-tight">
            ৳ 39.50 Lac
          </div>

          <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2.5 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">2 Cheques this week</span>
            <span className="text-purple-600 font-semibold text-xs font-mono">View PDC →</span>
          </div>
        </div>
      </div>

      {/* Middle Operations Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Department Workflow Chain */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                ⚡
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sequential Department Workflow Chain</h3>
                <p className="text-xs text-slate-500">Sequential handoff: Purchase → Store → Costing → Project → Accounts</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('workflow')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer font-mono"
            >
              <span>Manage Nodes →</span>
            </button>
          </div>

          {/* Stepper Pipeline */}
          <div className="grid grid-cols-5 gap-2 text-center text-xs font-medium">
            <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-blue-900">
              <span className="text-[10px] text-blue-600 font-mono block">Node 1</span>
              <strong className="text-xs">Purchase</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900">
              <span className="text-[10px] text-amber-600 font-mono block">Node 2</span>
              <strong className="text-xs">Store</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 text-indigo-900">
              <span className="text-[10px] text-indigo-600 font-mono block">Node 3</span>
              <strong className="text-xs">Costing</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-900">
              <span className="text-[10px] text-emerald-600 font-mono block">Node 4</span>
              <strong className="text-xs">Project</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200/80 text-purple-900">
              <span className="text-[10px] text-purple-600 font-mono block">Node 5</span>
              <strong className="text-xs">Accounts</strong>
            </div>
          </div>

          {/* Recent Handoff Activity Stream */}
          <div className="divide-y divide-slate-100 text-xs space-y-1">
            <div className="pt-2 pb-2.5 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 block text-xs">PO #PO-BSRM-2026-018 → 25 Ton Rebar Received</strong>
                <span className="text-[11px] text-slate-500 font-mono">Auto GRN generated at Site Store • ৳ 24,50,000</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold uppercase">
                Stock Updated
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 block text-xs">RA Bill #RA-BD-1082 → Bengal Structure & Civil Engr</strong>
                <span className="text-[11px] text-slate-500 font-mono">10% Retention (৳ 3.5L) & 5% AIT (৳ 1.75L) Withheld</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold uppercase">
                Approved
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 block text-xs">February 2026 Site Staff Payroll Sheet</strong>
                <span className="text-[11px] text-slate-500 font-mono">Net ৳ 2,40,200 BEFTN Bank batch file generated</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold uppercase">
                GL Posted
              </span>
            </div>
          </div>
        </div>

        {/* Right: Subcontractor Ledger */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                📐
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Subcontractor Ledger & Tax Deductions</h3>
                <p className="text-xs text-slate-500">RA Bill withholding breakdown</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('subcontracting-boq')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer font-mono"
            >
              <span>BoQ Engine →</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Billed to Date:</span>
                <strong className="text-slate-900">৳ 7,70,00,000</strong>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>Total Retention Held (10%):</span>
                <strong>-৳ 77,00,000</strong>
              </div>
              <div className="flex justify-between text-blue-700">
                <span>AIT Withholding (5%):</span>
                <strong>-৳ 38,50,000</strong>
              </div>
              <div className="flex justify-between text-rose-700">
                <span>Agro Advances Reconciled:</span>
                <strong>-৳ 1,50,000</strong>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-emerald-800 text-sm">
                <span>Net Disbursed to Partners:</span>
                <span>৳ 6,53,00,000</span>
              </div>
            </div>

            {/* Compliance Warning */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs">
              <span className="text-amber-600 font-bold">⚠</span>
              <div>
                <strong className="block text-amber-950">Bengal Structure Trade License Expires in 60 Days</strong>
                <span className="text-amber-800 text-[11px]">Renewal required before releasing next RA bill payment.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Modules Directory */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Enterprise Modules Directory</h2>
            <p className="text-xs text-slate-500">Direct navigation across all engineering, store, HR, and accounting suites</p>
          </div>

          {/* Category Filter Pills & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
              {['ALL', 'EXECUTIVE', 'CIVIL', 'PROCUREMENT', 'HR', 'FINANCE'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search modules..."
                value={moduleSearch}
                onChange={(e) => setModuleSearch(e.target.value)}
                className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => onNavigate(mod.id)}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 flex items-center justify-center font-bold text-sm">
                  {mod.symbol}
                </div>
                <span className="text-slate-300 group-hover:text-blue-600 text-xs font-mono font-bold">→</span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition">{mod.label}</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">{mod.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
