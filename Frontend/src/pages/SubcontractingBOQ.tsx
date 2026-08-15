import React, { useState } from 'react';
import {
  Calculator,
  FileCheck2,
  Receipt,
  Plus,
  ArrowDownRight,
  Printer,
  CheckCircle2,
  HardHat,
  Scale,
  DollarSign,
  AlertCircle,
  FileText,
  Search
} from 'lucide-react';
import { Project, BOQItem, WorkOrder, RABill, Vendor, StandardUOM } from '../types';
import { formatBDT, formatCompactBDT } from '../utils/financial';

interface SubcontractingBOQProps {
  project: Project;
  boqItems: BOQItem[];
  workOrders: WorkOrder[];
  raBills: RABill[];
  vendors: Vendor[];
  onApproveRABill: (billData: any) => void;
  onCreateWorkOrder?: (wo: Partial<WorkOrder>) => void;
}

export const SubcontractingBOQ: React.FC<SubcontractingBOQProps> = ({
  project,
  boqItems,
  workOrders,
  raBills,
  vendors,
  onApproveRABill
}) => {
  const [activeTab, setActiveTab] = useState<'boq' | 'work_orders' | 'ra_billing' | 'new_bill'>('ra_billing');
  const [selectedBill, setSelectedBill] = useState<RABill | null>(raBills[0] || null);

  // New RA Bill Form State with Automatic Deductions Calculator
  const [newBillVendorId, setNewBillVendorId] = useState<number>(3);
  const [mbNumber, setMbNumber] = useState('MB-SITE-2026-905');
  const [workDescription, setWorkDescription] = useState('10th Floor Column Reinforcement & Beam Shuttering Work');
  const [grossAmount, setGrossAmount] = useState<number>(3800000);
  const [retentionPct, setRetentionPct] = useState<number>(10);
  const [cashAdvanceRecovery, setCashAdvanceRecovery] = useState<number>(100000); // Agro / Advance
  const [materialBackcharge, setMaterialBackcharge] = useState<number>(45000);   // Direct material issue back-charge
  const [aitPct, setAitPct] = useState<number>(5);

  // Calculated values
  const retentionAmount = (grossAmount * retentionPct) / 100;
  const aitAmount = (grossAmount * aitPct) / 100;
  const totalDeductions = retentionAmount + cashAdvanceRecovery + materialBackcharge + aitAmount;
  const netPayable = grossAmount - totalDeductions;

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find((v) => v.id === Number(newBillVendorId));

    const billPayload = {
      project_id: project.id,
      project_name: project.project_name,
      sub_project_name: 'Tower A (14-Storey Superstructure)',
      vendor_id: newBillVendorId,
      subcontractor_name: vendor?.vendor_name || 'Subcontractor',
      mb_number: mbNumber,
      work_description: workDescription,
      gross_amount: grossAmount,
      retention_rate_pct: retentionPct,
      retention_amount: retentionAmount,
      cash_advance_recovery_bdt: cashAdvanceRecovery,
      material_backcharge_bdt: materialBackcharge,
      ait_rate_pct: aitPct,
      ait_amount: aitAmount,
      vat_rate_pct: 0,
      vat_amount: 0,
      other_deductions: 0,
      net_payable: netPayable,
    };

    onApproveRABill(billPayload);
    setActiveTab('ra_billing');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Module 05
              </span>
              <h1 className="text-xl font-bold text-slate-900">Subcontracting & Bill of Quantities (BoQ)</h1>
            </div>
            <p className="text-xs text-slate-500">
              Master BoQ (CFT/SFT/RFT/Ton/Bag), Work Orders, Running Account (RA) Billing with joint measurement & automatic deductions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('boq')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'boq' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Master BoQ Entry
            </button>
            <button
              onClick={() => setActiveTab('work_orders')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'work_orders' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Work Orders ({workOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('ra_billing')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ra_billing' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              RA Bills Ledger ({raBills.length})
            </button>
            <button
              onClick={() => setActiveTab('new_bill')}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New RA Bill Claim</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Master BoQ Entry */}
      {activeTab === 'boq' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Master Bill of Quantities (BoQ) Schedule</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Standard Measurement Units: CFT, SFT, RFT, Ton, Bag</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Item Code</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-4 py-3">Work Specification</th>
                  <th className="px-3 py-3 text-center">UOM</th>
                  <th className="px-3 py-3 text-right">Target Qty</th>
                  <th className="px-3 py-3 text-right">Approved Rate (BDT)</th>
                  <th className="px-3 py-3 text-right">Total Budget</th>
                  <th className="px-4 py-3 text-center">Consumption %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {boqItems.map((boq) => {
                  const pct = Math.round((boq.consumed_qty / boq.estimated_qty) * 100);
                  return (
                    <tr key={boq.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-blue-900">{boq.item_code}</td>
                      <td className="px-3 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold font-mono">
                          {boq.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-900">{boq.item_description}</td>
                      <td className="px-3 py-3.5 text-center font-bold text-slate-800">{boq.unit_of_measure}</td>
                      <td className="px-3 py-3.5 text-right font-mono">{boq.estimated_qty.toLocaleString()}</td>
                      <td className="px-3 py-3.5 text-right font-mono font-bold">৳ {boq.budget_rate_bdt.toLocaleString()}</td>
                      <td className="px-3 py-3.5 text-right font-mono font-bold text-slate-900">
                        {formatCompactBDT(boq.total_budget_bdt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-600">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Work Orders */}
      {activeTab === 'work_orders' && (
        <div className="space-y-4">
          {workOrders.map((wo) => (
            <div key={wo.id} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                    {wo.wo_number}
                  </span>
                  <span className="font-bold text-slate-900">{wo.subcontractor_name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span>Issued: <strong>{wo.issue_date}</strong></span>
                  <span>Target: <strong className="text-amber-700">{wo.completion_target}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">{wo.status}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600">{wo.scope_summary}</p>

              {/* Items Table */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70 overflow-x-auto">
                <table className="w-full text-xs text-slate-700">
                  <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 pb-1">
                    <tr>
                      <th className="text-left pb-1">BoQ Item Scope</th>
                      <th className="text-center pb-1">UOM</th>
                      <th className="text-right pb-1">Work Qty</th>
                      <th className="text-right pb-1">Agreed Rate</th>
                      <th className="text-right pb-1">Total Agreed Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50">
                    {wo.items.map((it, idx) => (
                      <tr key={idx} className="pt-1">
                        <td className="py-1.5 font-medium">{it.description}</td>
                        <td className="py-1.5 text-center font-bold">{it.uom}</td>
                        <td className="py-1.5 text-right font-mono">{it.work_qty.toLocaleString()}</td>
                        <td className="py-1.5 text-right font-mono">৳ {it.agreed_rate_bdt}</td>
                        <td className="py-1.5 text-right font-mono font-bold text-slate-900">৳ {it.total_amount_bdt.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Bar */}
              <div className="flex justify-between items-center text-xs font-mono bg-slate-900 text-white p-3 rounded-lg">
                <span>Contract Value: <strong className="text-amber-300">{formatBDT(wo.total_value_bdt)}</strong></span>
                <span>Billed to Date: <strong className="text-blue-300">{formatBDT(wo.billed_to_date_bdt)}</strong></span>
                <span>Retention Withhold: <strong>{wo.retention_rate_pct}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: RA Billing Ledger */}
      {activeTab === 'ra_billing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: RA Bills Table */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold tracking-wide uppercase">Running Account (RA) Bills & Vouchers</h2>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Verified Against Joint Site Measurement Book (MB)</span>
            </div>

            <div className="divide-y divide-slate-100">
              {raBills.map((bill) => {
                const isSelected = selectedBill?.id === bill.id;
                return (
                  <div
                    key={bill.id}
                    onClick={() => setSelectedBill(bill)}
                    className={`p-4 transition-all cursor-pointer ${
                      isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {bill.bill_number}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{bill.subcontractor_name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        bill.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {bill.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mb-2">{bill.work_description}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-slate-50 p-2 rounded border border-slate-200/60 font-mono">
                      <div>
                        <span className="text-slate-400 text-[10px] block">MB Number</span>
                        <strong>{bill.mb_number}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Gross Bill</span>
                        <strong>{formatCompactBDT(bill.gross_amount)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">10% Retention</span>
                        <span className="text-amber-700 font-bold">-{formatCompactBDT(bill.retention_amount)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Net Payable</span>
                        <strong className="text-emerald-700 font-bold">{formatCompactBDT(bill.net_payable)}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Formal Bangladesh Deduction Breakdown Sheet */}
          <div className="lg:col-span-4">
            {selectedBill && (
              <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden sticky top-6 space-y-4">
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold tracking-wide uppercase">Deductions Audit Sheet</h3>
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono">NBR & Contract Compliant</span>
                </div>

                <div className="p-4 space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Document Number</span>
                    <h3 className="text-sm font-bold text-slate-900 font-mono">{selectedBill.bill_number}</h3>
                    <p className="text-[11px] text-slate-500">{selectedBill.subcontractor_name}</p>
                  </div>

                  <div className="space-y-2 border-t border-b border-slate-100 py-3 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Gross Work Done:</span>
                      <span className="font-bold text-slate-900">{formatBDT(selectedBill.gross_amount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-amber-700">
                      <span>Less: 10% Retention Holdback:</span>
                      <span>-{formatBDT(selectedBill.retention_amount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-blue-700">
                      <span>Less: 5% AIT / TDS at Source:</span>
                      <span>-{formatBDT(selectedBill.ait_amount)}</span>
                    </div>
                    {selectedBill.cash_advance_recovery_bdt > 0 && (
                      <div className="flex justify-between items-center text-rose-700">
                        <span>Less: Site Agro Cash Advance:</span>
                        <span>-{formatBDT(selectedBill.cash_advance_recovery_bdt)}</span>
                      </div>
                    )}
                    {selectedBill.material_backcharge_bdt > 0 && (
                      <div className="flex justify-between items-center text-purple-700">
                        <span>Less: Direct Material Back-charge:</span>
                        <span>-{formatBDT(selectedBill.material_backcharge_bdt)}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between font-mono">
                    <span className="text-xs font-bold text-emerald-900">Net Payable to Subcontractor:</span>
                    <span className="text-sm font-bold text-emerald-700">{formatBDT(selectedBill.net_payable)}</span>
                  </div>

                  <div className="text-[10px] text-slate-400 leading-relaxed font-mono">
                    * Retention money will be released 6 months after defect liability period signoff.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: New RA Bill Claim Form */}
      {activeTab === 'new_bill' && (
        <form onSubmit={handleCreateBill} className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs max-w-2xl mx-auto space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Create Subcontractor RA Bill Claim</h2>
            <p className="text-xs text-slate-500">Calculate automatic deductions: Retention holdback, site Agro cash advances, back-charges and AIT.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subcontractor (Thika Partner)</label>
                <select
                  value={newBillVendorId}
                  onChange={(e) => setNewBillVendorId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800"
                >
                  {vendors.filter(v => v.vendor_type === 'Subcontractor').map(v => (
                    <option key={v.id} value={v.id}>{v.vendor_name} ({v.trade_specialization})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Measurement Book Ref (MB Number)</label>
                <input
                  type="text"
                  value={mbNumber}
                  onChange={(e) => setMbNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Scope of Work Completed</label>
              <input
                type="text"
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gross Bill Amount (BDT)</label>
                <input
                  type="number"
                  value={grossAmount}
                  onChange={(e) => setGrossAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Retention Holdback (%)</label>
                <input
                  type="number"
                  value={retentionPct}
                  onChange={(e) => setRetentionPct(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Site Cash Advance Recovery / Agro (BDT)</label>
                <input
                  type="number"
                  value={cashAdvanceRecovery}
                  onChange={(e) => setCashAdvanceRecovery(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Material Back-charges (BDT)</label>
                <input
                  type="number"
                  value={materialBackcharge}
                  onChange={(e) => setMaterialBackcharge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Live Auto-Calculated Summary Box */}
            <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">Gross Claim:</span>
                <span className="font-bold">{formatBDT(grossAmount)}</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>Retention ({retentionPct}%):</span>
                <span>-{formatBDT(retentionAmount)}</span>
              </div>
              <div className="flex justify-between text-blue-300">
                <span>AIT (5%):</span>
                <span>-{formatBDT(aitAmount)}</span>
              </div>
              <div className="flex justify-between text-rose-300">
                <span>Agro Advance + Backcharges:</span>
                <span>-{formatBDT(cashAdvanceRecovery + materialBackcharge)}</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex justify-between text-sm font-bold text-emerald-400">
                <span>Net Payable:</span>
                <span>{formatBDT(netPayable)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('ra_billing')}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              Submit RA Bill for Approval
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
