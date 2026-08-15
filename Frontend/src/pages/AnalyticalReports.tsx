import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Scale,
  PieChart,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Download,
  FileSpreadsheet,
  Building,
  DollarSign
} from 'lucide-react';
import {
  ProjectCostVariance,
  AgingBucket,
  MaterialConsumptionWastage,
  ChartOfAccount
} from '../types';
import { formatBDT, formatCompactBDT } from '../utils/financial';

interface AnalyticalReportsProps {
  accounts: ChartOfAccount[];
  costVariances: ProjectCostVariance[];
  agingBuckets: AgingBucket[];
  wastageAnalytics: MaterialConsumptionWastage[];
}

export const AnalyticalReports: React.FC<AnalyticalReportsProps> = ({
  accounts,
  costVariances,
  agingBuckets,
  wastageAnalytics
}) => {
  const [reportType, setReportType] = useState<'pnl' | 'balance_sheet' | 'variance' | 'aging' | 'wastage'>('pnl');

  // Compute P&L
  const totalRevenue = accounts.filter(a => a.account_type === 'Revenue').reduce((acc, a) => acc + a.balance_bdt, 0);
  const totalDirectCost = accounts.filter(a => a.category === 'Direct Cost').reduce((acc, a) => acc + a.balance_bdt, 0);
  const totalSiteOverheads = accounts.filter(a => a.category === 'Site Overhead').reduce((acc, a) => acc + a.balance_bdt, 0);
  const totalExpenses = totalDirectCost + totalSiteOverheads;
  const netProfit = totalRevenue - totalExpenses;

  // Compute Balance Sheet
  const totalAssets = accounts.filter(a => a.account_type === 'Asset').reduce((acc, a) => acc + a.balance_bdt, 0);
  const totalLiabilities = accounts.filter(a => a.account_type === 'Liability').reduce((acc, a) => acc + a.balance_bdt, 0);
  const totalEquity = accounts.filter(a => a.account_type === 'Equity').reduce((acc, a) => acc + a.balance_bdt, 0) + netProfit;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Module 14
              </span>
              <h1 className="text-xl font-bold text-slate-900">Statistical & Analytical Construction Reports</h1>
            </div>
            <p className="text-xs text-slate-500">
              Real-time Profit & Loss (P&L), Balance Sheet, Project Cost Variance (Budget vs Actual), Payable/Receivable Aging & Material Wastage Analytics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Financial Report</span>
            </button>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setReportType('pnl')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
              reportType === 'pnl' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Profit & Loss (P&L)
          </button>
          <button
            onClick={() => setReportType('balance_sheet')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
              reportType === 'balance_sheet' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setReportType('variance')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
              reportType === 'variance' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Budget vs Actual Variance
          </button>
          <button
            onClick={() => setReportType('aging')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
              reportType === 'aging' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            AP / AR Aging Analysis
          </button>
          <button
            onClick={() => setReportType('wastage')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
              reportType === 'wastage' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Material Wastage Analytics
          </button>
        </div>
      </div>

      {/* REPORT 1: Profit & Loss */}
      {reportType === 'pnl' && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs max-w-3xl mx-auto space-y-5">
          <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase">Statement of Profit or Loss (P&L)</h2>
              <p className="text-xs text-slate-500 font-mono">For the Year Ended 30 June 2026 (Real-time)</p>
            </div>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-mono font-bold text-xs rounded">
              BDT in Full
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Revenue */}
            <div>
              <div className="flex justify-between font-bold text-slate-900 bg-slate-50 p-2 rounded">
                <span className="font-sans">Operating Revenue (Apartment Sales):</span>
                <span>{formatBDT(totalRevenue)}</span>
              </div>
            </div>

            {/* Direct Construction Costs */}
            <div className="space-y-1 pl-3 border-l-2 border-slate-200">
              <span className="font-bold text-slate-700 font-sans block">Direct Construction Costs:</span>
              <div className="flex justify-between text-slate-600">
                <span>Civil & Structural Works:</span>
                <span>৳ 28,40,00,000</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Site Labor Hazira Wages:</span>
                <span>৳ 1,89,00,000</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Direct Costs:</span>
                <span>{formatBDT(totalDirectCost)}</span>
              </div>
            </div>

            {/* Gross Profit */}
            <div className="flex justify-between font-bold text-blue-900 bg-blue-50 p-2.5 rounded border border-blue-200 text-sm">
              <span className="font-sans">Gross Profit Margin:</span>
              <span>{formatBDT(totalRevenue - totalDirectCost)}</span>
            </div>

            {/* Overheads */}
            <div className="space-y-1 pl-3 border-l-2 border-slate-200">
              <span className="font-bold text-slate-700 font-sans block">Site Operating Overheads:</span>
              <div className="flex justify-between text-slate-600">
                <span>Engineers & Staff Payroll:</span>
                <span>{formatBDT(totalSiteOverheads)}</span>
              </div>
            </div>

            {/* Net Profit */}
            <div className="flex justify-between font-bold text-emerald-950 bg-emerald-100 p-3 rounded-lg border border-emerald-300 text-base">
              <span className="font-sans">Net Operating Profit:</span>
              <span>{formatBDT(netProfit)}</span>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2: Balance Sheet */}
      {reportType === 'balance_sheet' && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs max-w-3xl mx-auto space-y-5">
          <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase">Statement of Financial Position (Balance Sheet)</h2>
              <p className="text-xs text-slate-500 font-mono">As of 15 February 2026</p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-mono font-bold text-xs rounded">
              Assets = Liabilities + Equity
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Assets */}
            <div className="space-y-1">
              <div className="font-bold text-slate-900 bg-slate-50 p-2 rounded flex justify-between">
                <span className="font-sans">Current Assets:</span>
                <span>{formatBDT(totalAssets)}</span>
              </div>
              <div className="pl-3 text-slate-600 space-y-0.5 text-[11px]">
                <div className="flex justify-between"><span>Cash & Bank Balances:</span><span>৳ 9,34,00,000</span></div>
                <div className="flex justify-between"><span>Site Raw Material Inventory:</span><span>৳ 1,84,00,000</span></div>
                <div className="flex justify-between"><span>Site Agro Advances Recoverable:</span><span>৳ 21,00,000</span></div>
              </div>
            </div>

            {/* Liabilities */}
            <div className="space-y-1">
              <div className="font-bold text-slate-900 bg-slate-50 p-2 rounded flex justify-between">
                <span className="font-sans">Current Liabilities:</span>
                <span>{formatBDT(totalLiabilities)}</span>
              </div>
              <div className="pl-3 text-slate-600 space-y-0.5 text-[11px]">
                <div className="flex justify-between"><span>Subcontractor & Supplier Payable:</span><span>৳ 2,25,45,000</span></div>
                <div className="flex justify-between"><span>10% Subcontractor Retention Held:</span><span>৳ 66,50,000</span></div>
                <div className="flex justify-between"><span>AIT & VAT Tax Payable (NBR):</span><span>৳ 9,05,000</span></div>
              </div>
            </div>

            {/* Equity */}
            <div className="space-y-1">
              <div className="font-bold text-slate-900 bg-slate-50 p-2 rounded flex justify-between">
                <span className="font-sans">Shareholders' Equity & Retained Earnings:</span>
                <span>{formatBDT(totalEquity)}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-lg flex justify-between items-center text-sm font-bold">
              <span>Total Liabilities & Equity:</span>
              <span className="text-emerald-400">{formatBDT(totalLiabilities + totalEquity)}</span>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 3: Budget vs Actual Variance */}
      {reportType === 'variance' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Project Cost Variance (Budget vs Actual)</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">By Sub-Project & BoQ Line Item</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 font-mono">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 font-sans">
                <tr>
                  <th className="px-4 py-3">Sub-Project</th>
                  <th className="px-3 py-3">BoQ Category</th>
                  <th className="px-3 py-3 text-right">Allocated Budget</th>
                  <th className="px-3 py-3 text-right">Actual Spent</th>
                  <th className="px-3 py-3 text-right">Cost Variance</th>
                  <th className="px-4 py-3 text-center">Variance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {costVariances.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-sans font-bold text-slate-900">{v.sub_project_name}</td>
                    <td className="px-3 py-3.5 font-sans text-slate-600">{v.boq_category}</td>
                    <td className="px-3 py-3.5 text-right font-bold">{formatBDT(v.budget_bdt)}</td>
                    <td className="px-3 py-3.5 text-right text-blue-900 font-bold">{formatBDT(v.actual_spent_bdt)}</td>
                    <td className="px-3 py-3.5 text-right text-emerald-700 font-bold">{formatBDT(v.variance_bdt)}</td>
                    <td className="px-4 py-3.5 text-center font-bold">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
                        {v.variance_pct}% (Under Budget)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 4: AP / AR Aging Analysis */}
      {reportType === 'aging' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Payables & Receivables Aging Analysis</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">0-30, 31-60, 61-90 & 90+ Days Buckets</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 font-mono">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 font-sans">
                <tr>
                  <th className="px-4 py-3">Party Name</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3 text-right">Total Balance Due</th>
                  <th className="px-3 py-3 text-right">0-30 Days</th>
                  <th className="px-3 py-3 text-right">31-60 Days</th>
                  <th className="px-3 py-3 text-right">61-90 Days</th>
                  <th className="px-4 py-3 text-right text-rose-700 font-bold">90+ Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agingBuckets.map((ag, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-sans font-bold text-slate-900">{ag.party_name}</td>
                    <td className="px-3 py-3.5 font-sans">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {ag.party_type}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-right font-bold text-slate-900">{formatBDT(ag.total_due_bdt)}</td>
                    <td className="px-3 py-3.5 text-right text-emerald-700 font-bold">৳ {ag.days_0_30.toLocaleString()}</td>
                    <td className="px-3 py-3.5 text-right text-blue-700 font-bold">৳ {ag.days_31_60.toLocaleString()}</td>
                    <td className="px-3 py-3.5 text-right text-amber-700 font-bold">৳ {ag.days_61_90.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right text-rose-700 font-bold">৳ {ag.days_90_plus.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 5: Material Wastage Analytics */}
      {reportType === 'wastage' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Material Consumption & Site Wastage Analytics</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">BoQ Estimated vs Actual Store Issues</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 font-mono">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 font-sans">
                <tr>
                  <th className="px-4 py-3">Material Name & Code</th>
                  <th className="px-3 py-3 text-right">BoQ Estimate</th>
                  <th className="px-3 py-3 text-right">Actual Issued</th>
                  <th className="px-3 py-3 text-right text-rose-700">Wastage Qty</th>
                  <th className="px-3 py-3 text-center">Wastage %</th>
                  <th className="px-3 py-3 text-center">Allowable Limit</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wastageAnalytics.map((w, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-sans font-bold text-slate-900">{w.item_name}</td>
                    <td className="px-3 py-3.5 text-right">{w.boq_estimated_qty.toLocaleString()} {w.unit}</td>
                    <td className="px-3 py-3.5 text-right font-bold text-blue-900">{w.actual_issued_qty.toLocaleString()} {w.unit}</td>
                    <td className="px-3 py-3.5 text-right font-bold text-rose-700">{w.wastage_qty} {w.unit}</td>
                    <td className="px-3 py-3.5 text-center font-bold">{w.wastage_pct}%</td>
                    <td className="px-3 py-3.5 text-center text-slate-500">{w.allowable_limit_pct}%</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        w.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {w.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
