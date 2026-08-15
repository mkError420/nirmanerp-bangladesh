import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Building,
  ShieldCheck,
  Percent,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  BookOpen
} from 'lucide-react';
import { RABill, Vendor, Project } from '../types';
import { formatBDT, calculateRABillBreakdown } from '../utils/financial';

interface RABillsProps {
  project: Project;
  vendors: Vendor[];
  raBills: RABill[];
  onApproveRABill: (billData: any) => void;
}

export const RABills: React.FC<RABillsProps> = ({
  project,
  vendors,
  raBills,
  onApproveRABill,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<number>(3); // Default Subcontractor
  const [mbNumber, setMbNumber] = useState('MB-SITE-2026-902');
  const [workDescription, setWorkDescription] = useState('10th Floor Slab Shuttering & Concrete Casting Work');
  const [grossAmount, setGrossAmount] = useState<number>(4500000); // 45 Lac BDT
  const [retentionRate, setRetentionRate] = useState<number>(10.0); // 10% Retention
  const [aitRate, setAitRate] = useState<number>(5.0); // 5% BD AIT/TDS
  const [selectedBillForJournal, setSelectedBillForJournal] = useState<RABill | null>(null);

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];

  // Dynamic Breakdown Calculation
  const breakdown = calculateRABillBreakdown(grossAmount, retentionRate, aitRate, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onApproveRABill({
      project_id: project.id,
      vendor_id: selectedVendorId,
      subcontractor_name: selectedVendor?.vendor_name || 'Bengal Structure & Civil Engr',
      mb_number: mbNumber,
      work_description: workDescription,
      gross_amount: grossAmount,
      retention_rate_pct: retentionRate,
      ait_rate_pct: aitRate,
      vat_rate_pct: 0,
    });

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-1 font-mono">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Subcontractor Financial Billing</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Running Account (RA) Bills & Retention Capping</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Measurement Book (MB) verified subcontractor bills with auto 10% Retention Security Money and 5% BD AIT Tax Withholding.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded text-xs font-semibold flex items-center space-x-2 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Subcontractor RA Bill</span>
        </button>
      </div>

      {/* RA Bills Data Grid */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Bill Ref / Date</th>
                <th className="px-4 py-3">Subcontractor & MB Ref</th>
                <th className="px-4 py-3 text-right">Gross Work Done</th>
                <th className="px-4 py-3 text-right">10% Retention</th>
                <th className="px-4 py-3 text-right">5% AIT Tax</th>
                <th className="px-4 py-3 text-right">Net Payable</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Auto GL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[12px] font-mono">
              {raBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 block">{bill.bill_number}</span>
                    <span className="text-[10px] text-slate-400 block">{bill.bill_date}</span>
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <span className="font-semibold text-slate-900 block">{bill.subcontractor_name}</span>
                    <span className="text-[10px] font-mono text-blue-600 block">MB #{bill.mb_number}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">
                    {formatBDT(bill.gross_amount)}
                  </td>
                  <td className="px-4 py-3 text-right text-amber-700 font-semibold">
                    -{formatBDT(bill.retention_amount)}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-700 font-semibold">
                    -{formatBDT(bill.ait_amount)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-blue-700">
                    {formatBDT(bill.net_payable)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700">
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedBillForJournal(bill)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer font-mono"
                    >
                      <BookOpen className="w-3 h-3 text-blue-600" />
                      <span>JV</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Data Grid Footer Pagination Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center font-bold uppercase tracking-wider px-4 font-mono">
          <span>Showing {raBills.length} Subcontractor Bills</span>
          <span className="text-blue-600">Total Approved Value: {formatBDT(raBills.reduce((acc, b) => acc + b.net_payable, 0))}</span>
        </div>
      </div>

      {/* New RA Bill Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-xs">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">New Subcontractor RA Bill</h3>
                <p className="text-xs text-slate-300">MB Ref Calculation with Retention & AIT Withholding</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subcontractor *</label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vendor_name} ({v.vendor_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Measurement Book Ref (MB #) *</label>
                  <input
                    type="text"
                    required
                    value={mbNumber}
                    onChange={(e) => setMbNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gross Work Done (BDT) *</label>
                  <input
                    type="number"
                    required
                    value={grossAmount}
                    onChange={(e) => setGrossAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Description</label>
                <input
                  type="text"
                  required
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Retention Security %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={retentionRate}
                    onChange={(e) => setRetentionRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-amber-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">AIT / TDS Tax % (BD Rule)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={aitRate}
                    onChange={(e) => setAitRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-emerald-700"
                  />
                </div>
              </div>

              {/* Dynamic Auto Calculation Live Box */}
              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-1.5">
                <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider block">
                  Live Accounting Auto-Calculation
                </span>
                <div className="flex justify-between">
                  <span>Gross Work Valuation:</span>
                  <strong>{formatBDT(breakdown.grossAmount)}</strong>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Less Retention Money ({breakdown.retentionPct}%):</span>
                  <strong>-{formatBDT(breakdown.retentionAmount)}</strong>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Less AIT Withholding Tax ({breakdown.aitPct}%):</span>
                  <strong>-{formatBDT(breakdown.aitAmount)}</strong>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Net Subcontractor Payable:</span>
                  <span className="text-blue-400">{formatBDT(breakdown.netPayable)}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md cursor-pointer"
                >
                  Approve RA Bill & Post Auto GL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auto Journal Preview Modal */}
      {selectedBillForJournal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Auto General Ledger Journal Entry</h3>
                <p className="text-xs text-slate-500">Triggered on RA Bill #{selectedBillForJournal.bill_number}</p>
              </div>
              <button onClick={() => setSelectedBillForJournal(null)} className="text-slate-400 hover:text-slate-800 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-semibold text-[10px] text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Account Code & Description</th>
                    <th className="p-2.5 text-right">Debit (BDT)</th>
                    <th className="p-2.5 text-right">Credit (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="p-2.5">
                      <span className="font-bold text-slate-900 block">5100-CIVIL-WORK</span>
                      <span className="text-[10px] text-slate-500">Direct Civil Construction Expense</span>
                    </td>
                    <td className="p-2.5 text-right font-bold text-slate-900">{formatBDT(selectedBillForJournal.gross_amount)}</td>
                    <td className="p-2.5 text-right text-slate-400">0.00</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">
                      <span className="font-bold text-amber-800 block">2150-RETENTION-MONEY</span>
                      <span className="text-[10px] text-slate-500">Subcontractor Security Money Held</span>
                    </td>
                    <td className="p-2.5 text-right text-slate-400">0.00</td>
                    <td className="p-2.5 text-right font-bold text-amber-800">{formatBDT(selectedBillForJournal.retention_amount)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">
                      <span className="font-bold text-emerald-800 block">2120-AIT-TAX-PAYABLE</span>
                      <span className="text-[10px] text-slate-500">NBR Income Tax Deducted at Source</span>
                    </td>
                    <td className="p-2.5 text-right text-slate-400">0.00</td>
                    <td className="p-2.5 text-right font-bold text-emerald-800">{formatBDT(selectedBillForJournal.ait_amount)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">
                      <span className="font-bold text-blue-800 block">2100-SUBCONTRACTOR-PAYABLE</span>
                      <span className="text-[10px] text-slate-500">Subcontractor Accounts Payable</span>
                    </td>
                    <td className="p-2.5 text-right text-slate-400">0.00</td>
                    <td className="p-2.5 text-right font-bold text-blue-800">{formatBDT(selectedBillForJournal.net_payable)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-3 flex items-center justify-end">
              <button
                onClick={() => setSelectedBillForJournal(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
