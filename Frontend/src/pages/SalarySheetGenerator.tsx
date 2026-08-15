import React, { useState } from 'react';
import {
  Printer,
  FileSpreadsheet,
  Download,
  Calendar,
  Calculator,
  Building,
  CheckCircle2,
  Users,
  Search,
  Filter
} from 'lucide-react';
import { MonthlyPayrollRecord, DepartmentCode } from '../types';
import { formatBDT, formatCompactBDT } from '../utils/financial';

interface SalarySheetGeneratorProps {
  payrollRecords: MonthlyPayrollRecord[];
  onDisbursePayroll?: () => void;
}

export const SalarySheetGenerator: React.FC<SalarySheetGeneratorProps> = ({
  payrollRecords,
  onDisbursePayroll
}) => {
  const [selectedMonth, setSelectedMonth] = useState('February 2026');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const filteredRecords = payrollRecords.filter((rec) => {
    const matchesDept = selectedDept === 'ALL' || rec.department === selectedDept;
    return matchesDept;
  });

  const totalGross = filteredRecords.reduce((acc, r) => acc + r.gross_earnings_bdt, 0);
  const totalAgroAdvance = filteredRecords.reduce((acc, r) => acc + r.site_cash_advance_agro_bdt, 0);
  const totalTaxTds = filteredRecords.reduce((acc, r) => acc + r.tax_tds_deductions_bdt, 0);
  const totalNet = filteredRecords.reduce((acc, r) => acc + r.net_salary_bdt, 0);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Module 11
              </span>
              <h1 className="text-xl font-bold text-slate-900">Printable Salary Sheet Generator (Monthly Payroll)</h1>
            </div>
            <p className="text-xs text-slate-500">
              Formula: <strong>Net = (Basic + Allowances + OT) - (Absences + Site Agro Advances + Tax TDS)</strong>. Grouped by Department & Site with employee sign-off stamps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPrintModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Official Salary Sheet</span>
            </button>
            <button
              onClick={() => window.print()}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export to Excel / CSV</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Month:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded font-mono"
              >
                <option value="February 2026">February 2026</option>
                <option value="January 2026">January 2026</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Department:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded font-mono"
              >
                <option value="ALL">All Departments</option>
                <option value="PROJECT">Project Site Engineers</option>
                <option value="COSTING">Costing & Billing</option>
                <option value="STORE">Storekeepers</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span>Gross: <strong className="text-slate-900">{formatCompactBDT(totalGross)}</strong></span>
            <span>Agro Rec: <strong className="text-rose-700">-{formatCompactBDT(totalAgroAdvance)}</strong></span>
            <span>Tax TDS: <strong className="text-blue-700">-{formatCompactBDT(totalTaxTds)}</strong></span>
            <span>Net Disbursal: <strong className="text-emerald-700">{formatCompactBDT(totalNet)}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Interactive Salary Sheet Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold tracking-wide uppercase">Monthly Payroll Computation Schedule ({selectedMonth})</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Compliant with Bangladesh Income Tax Act 2023</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-3 py-3">Emp Code & Name</th>
                <th className="px-3 py-3">Designation & Dept</th>
                <th className="px-3 py-3 text-right">Basic Pay</th>
                <th className="px-3 py-3 text-right">Allowances</th>
                <th className="px-3 py-3 text-right">Overtime</th>
                <th className="px-3 py-3 text-right">Gross Total</th>
                <th className="px-3 py-3 text-right text-rose-700">Agro Site Advance</th>
                <th className="px-3 py-3 text-right text-blue-700">Tax / TDS</th>
                <th className="px-3 py-3 text-right font-bold text-emerald-800">Net Payable</th>
                <th className="px-3 py-3 text-center">Payout Channel</th>
                <th className="px-3 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-3 py-3.5">
                    <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-1 py-0.2 rounded border border-blue-200 block w-max mb-0.5">
                      {rec.employee_code}
                    </span>
                    <strong className="font-sans text-slate-900 text-xs">{rec.name}</strong>
                  </td>
                  <td className="px-3 py-3.5 font-sans">
                    <span className="text-slate-800 font-medium block">{rec.designation}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{rec.department}</span>
                  </td>
                  <td className="px-3 py-3.5 text-right">৳ {rec.basic_bdt.toLocaleString()}</td>
                  <td className="px-3 py-3.5 text-right">৳ {rec.allowances_bdt.toLocaleString()}</td>
                  <td className="px-3 py-3.5 text-right text-amber-700">৳ {rec.overtime_bdt.toLocaleString()}</td>
                  <td className="px-3 py-3.5 text-right font-bold text-slate-900">৳ {rec.gross_earnings_bdt.toLocaleString()}</td>
                  <td className="px-3 py-3.5 text-right text-rose-600 font-bold">
                    {rec.site_cash_advance_agro_bdt > 0 ? `-৳ ${rec.site_cash_advance_agro_bdt.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-3 py-3.5 text-right text-blue-700">
                    {rec.tax_tds_deductions_bdt > 0 ? `-৳ ${rec.tax_tds_deductions_bdt.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-3 py-3.5 text-right font-bold text-emerald-700 text-sm">
                    ৳ {rec.net_salary_bdt.toLocaleString()}
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {rec.payout_channel}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      {rec.disbursal_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Total Row */}
            <tfoot className="bg-slate-900 text-white font-mono text-xs font-bold">
              <tr>
                <td className="px-3 py-3 font-sans" colSpan={5}>Total Monthly Disbursals ({filteredRecords.length} Employees):</td>
                <td className="px-3 py-3 text-right">{formatBDT(totalGross)}</td>
                <td className="px-3 py-3 text-right text-rose-400">-{formatBDT(totalAgroAdvance)}</td>
                <td className="px-3 py-3 text-right text-blue-300">-{formatBDT(totalTaxTds)}</td>
                <td className="px-3 py-3 text-right text-emerald-400 text-sm" colSpan={3}>
                  {formatBDT(totalNet)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Formal Printable Salary Sheet Modal */}
      {printModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 border border-slate-200 shadow-2xl space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Bangladesh Official Payroll Header */}
            <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
              <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight">NIRMAN ERP BANGLADESH</h2>
              <p className="text-xs text-slate-600 font-mono">Head Office: Road 11, Gulshan-1, Dhaka-1212</p>
              <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider bg-slate-100 py-1 rounded inline-block px-4 font-mono">
                OFFICIAL MONTHLY SALARY & WAGE DISBURSAL SHEET — {selectedMonth.toUpperCase()}
              </h3>
            </div>

            {/* Formal Printable Table */}
            <table className="w-full text-xs text-slate-900 border border-slate-300">
              <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-700 border-b border-slate-300">
                <tr>
                  <th className="p-2 border border-slate-300">SL</th>
                  <th className="p-2 border border-slate-300 text-left">Employee Name & Code</th>
                  <th className="p-2 border border-slate-300 text-left">Designation</th>
                  <th className="p-2 border border-slate-300 text-right">Gross (BDT)</th>
                  <th className="p-2 border border-slate-300 text-right">Agro Rec</th>
                  <th className="p-2 border border-slate-300 text-right">TDS Tax</th>
                  <th className="p-2 border border-slate-300 text-right">Net Payable</th>
                  <th className="p-2 border border-slate-300 text-center w-36">Employee Signature / Seal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                {filteredRecords.map((rec, idx) => (
                  <tr key={rec.id}>
                    <td className="p-2 border border-slate-300 text-center">{idx + 1}</td>
                    <td className="p-2 border border-slate-300 font-sans font-bold">
                      {rec.name} <span className="text-[10px] text-slate-500 font-mono">({rec.employee_code})</span>
                    </td>
                    <td className="p-2 border border-slate-300 font-sans">{rec.designation}</td>
                    <td className="p-2 border border-slate-300 text-right">৳ {rec.gross_earnings_bdt.toLocaleString()}</td>
                    <td className="p-2 border border-slate-300 text-right text-rose-700">
                      {rec.site_cash_advance_agro_bdt > 0 ? `৳ ${rec.site_cash_advance_agro_bdt.toLocaleString()}` : '—'}
                    </td>
                    <td className="p-2 border border-slate-300 text-right">
                      {rec.tax_tds_deductions_bdt > 0 ? `৳ ${rec.tax_tds_deductions_bdt.toLocaleString()}` : '—'}
                    </td>
                    <td className="p-2 border border-slate-300 text-right font-bold text-slate-950">
                      ৳ {rec.net_salary_bdt.toLocaleString()}
                    </td>
                    <td className="p-2 border border-slate-300 text-center text-slate-300 italic text-[10px]">
                      [ Signature ]
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Authorizations */}
            <div className="grid grid-cols-4 gap-4 pt-8 text-center text-[10px] font-mono border-t border-slate-200">
              <div>
                <div className="h-10 border-b border-dashed border-slate-400 flex items-center justify-center text-slate-400 italic">
                  Farzana Sharmin
                </div>
                <span className="text-slate-600 block mt-1">HR Officer (Prepared)</span>
              </div>
              <div>
                <div className="h-10 border-b border-dashed border-slate-400 flex items-center justify-center text-slate-400 italic">
                  Engr. Kamrul Hasan
                </div>
                <span className="text-slate-600 block mt-1">Project Site Manager</span>
              </div>
              <div>
                <div className="h-10 border-b border-dashed border-slate-400 flex items-center justify-center text-slate-400 italic">
                  Arif Elahi, ACA
                </div>
                <span className="text-slate-600 block mt-1">Finance Manager (Audited)</span>
              </div>
              <div>
                <div className="h-10 border-b border-dashed border-slate-400 flex items-center justify-center text-slate-400 italic">
                  Engr. Mahbubur Rahman
                </div>
                <span className="text-slate-600 block mt-1 font-bold">Managing Director</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPrintModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print Official Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
