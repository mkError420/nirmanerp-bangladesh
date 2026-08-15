import React, { useState } from 'react';
import {
  Building2,
  Truck,
  FileCheck2,
  PackagePlus,
  Send,
  ArrowRightLeft,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Scale
} from 'lucide-react';
import {
  Project,
  GRN,
  GatePassLog,
  StoreIssueVoucher,
  StockTransfer,
  StockLedgerItem,
  Vendor
} from '../types';
import { formatBDT, formatCompactBDT } from '../utils/financial';

interface StoreInventoryGRNProps {
  project: Project;
  grns: GRN[];
  gatePasses: GatePassLog[];
  issueVouchers: StoreIssueVoucher[];
  stockTransfers: StockTransfer[];
  stockLedger: StockLedgerItem[];
  vendors: Vendor[];
  onAddGRN?: (newGRN: any) => void;
  onAddIssueVoucher?: (newSIV: any) => void;
}

export const StoreInventoryGRN: React.FC<StoreInventoryGRNProps> = ({
  project,
  grns,
  gatePasses,
  issueVouchers,
  stockTransfers,
  stockLedger,
  vendors,
  onAddGRN
}) => {
  const [activeTab, setActiveTab] = useState<'grn' | 'gate_pass' | 'siv' | 'transfers' | 'ledger'>('grn');
  const [selectedGRN, setSelectedGRN] = useState<GRN | null>(grns[0] || null);

  // New GRN Modal Form State
  const [newGRNModalOpen, setNewGRNModalOpen] = useState(false);
  const [poNumber, setPoNumber] = useState('PO-BSRM-2026-018');
  const [vendorName, setVendorName] = useState('BSRM Steels Limited');
  const [chalanNo, setChalanNo] = useState('BSRM-CHL-99210');
  const [vehicleNo, setVehicleNo] = useState('Dhaka Metro-TA-11-9284');
  const [receivedQty, setReceivedQty] = useState<number>(25);
  const [acceptedQty, setAcceptedQty] = useState<number>(25);
  const [rejectedQty, setRejectedQty] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(98000);
  const [rejectionReason, setRejectionReason] = useState('');
  const [grnSuccess, setGrnSuccess] = useState<string | null>(null);

  const handleSaveGRN = (e: React.FormEvent) => {
    e.preventDefault();
    const grnData = {
      grn_number: `GRN-SITE-${Date.now().toString().slice(-6)}`,
      po_id: 1,
      po_number: poNumber,
      project_id: project.id,
      project_name: project.project_name,
      vendor_id: 1,
      vendor_name: vendorName,
      received_date: new Date().toISOString().split('T')[0],
      chalan_number: chalanNo,
      vehicle_no: vehicleNo,
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
          received_qty: receivedQty,
          accepted_qty: acceptedQty,
          rejected_qty: rejectedQty,
          rejection_reason: rejectionReason,
          unit_price_bdt: unitPrice,
          total_value_bdt: acceptedQty * unitPrice
        }
      ]
    };

    if (onAddGRN) onAddGRN(grnData);
    setNewGRNModalOpen(false);
    setGrnSuccess(`GRN generated. Accepted ${acceptedQty} Ton into Site Store. Cost Ledger and GL automatically posted.`);
    setTimeout(() => setGrnSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Module 09
              </span>
              <h1 className="text-xl font-bold text-slate-900">Store & Inventory Management (Item Receiving & Issues)</h1>
            </div>
            <p className="text-xs text-slate-500">
              Goods Received Notes (GRN) with accepted vs rejected split, Gate Pass delivery logs, Store Issue Vouchers (SIV), and FIFO/Weighted Average valuation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('grn')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'grn' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Goods Received (GRN)
            </button>
            <button
              onClick={() => setActiveTab('gate_pass')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'gate_pass' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Gate Pass Logs
            </button>
            <button
              onClick={() => setActiveTab('siv')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'siv' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Store Issues (SIV)
            </button>
            <button
              onClick={() => setActiveTab('transfers')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'transfers' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Site Transfers
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ledger' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Stock Ledger
            </button>

            <button
              onClick={() => setNewGRNModalOpen(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer ml-2"
            >
              <PackagePlus className="w-3.5 h-3.5" />
              <span>Receive New Delivery (GRN)</span>
            </button>
          </div>
        </div>
      </div>

      {grnSuccess && (
        <div className="bg-emerald-900 text-white px-4 py-2.5 rounded-lg border border-emerald-500/50 text-xs font-medium animate-fade-in flex items-center justify-between">
          <span>{grnSuccess}</span>
          <span className="text-[10px] font-mono text-emerald-300">Inventory Updated</span>
        </div>
      )}

      {/* TAB 1: GRN List & Inspector */}
      {activeTab === 'grn' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            {grns.map((grn) => {
              const isSelected = selectedGRN?.id === grn.id;
              return (
                <div
                  key={grn.id}
                  onClick={() => setSelectedGRN(grn)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-600/20'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-900 px-2 py-0.5 rounded border border-slate-200">
                          {grn.grn_number}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{grn.vendor_name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Challan: {grn.chalan_number} | Vehicle: {grn.vehicle_no}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono uppercase">
                      {grn.status}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 space-y-1.5 my-2">
                    {grn.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-mono">
                        <span>{it.item_description}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-700 font-bold">Acc: {it.accepted_qty} {it.unit_of_measure}</span>
                          {it.rejected_qty > 0 && (
                            <span className="text-rose-600 font-bold bg-rose-50 px-1 rounded">Rej: {it.rejected_qty}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Storekeeper: <strong>{grn.site_store_keeper}</strong></span>
                    <span>Received: {grn.received_date}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-5">
            {selectedGRN && (
              <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden sticky top-6 space-y-4">
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold tracking-wide uppercase">GRN Quality Inspection Sheet</h3>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono">Auto Stock Credited</span>
                </div>

                <div className="p-4 space-y-4 text-xs">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{selectedGRN.grn_number}</h3>
                    <p className="text-[11px] text-slate-500 font-mono">Supplier: {selectedGRN.vendor_name}</p>
                  </div>

                  {/* Vehicle & Chalan Details */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Supplier Challan No:</span>
                      <strong>{selectedGRN.chalan_number}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Transport Vehicle:</span>
                      <strong>{selectedGRN.vehicle_no}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Driver Contact:</span>
                      <span>{selectedGRN.driver_name} ({selectedGRN.driver_contact})</span>
                    </div>
                  </div>

                  {/* Accepted vs Rejected Breakdown */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Item Inspection Quantities</div>
                    {selectedGRN.items.map((it, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-slate-200 space-y-2 bg-slate-50/50">
                        <strong className="block text-slate-900">{it.item_description}</strong>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                          <div className="bg-white p-1.5 rounded border border-slate-200">
                            <span className="text-[9px] text-slate-400 block uppercase">Received</span>
                            <span className="font-bold text-slate-900">{it.received_qty}</span>
                          </div>
                          <div className="bg-emerald-50 p-1.5 rounded border border-emerald-200">
                            <span className="text-[9px] text-emerald-700 block uppercase">Accepted</span>
                            <span className="font-bold text-emerald-800">{it.accepted_qty}</span>
                          </div>
                          <div className="bg-rose-50 p-1.5 rounded border border-rose-200">
                            <span className="text-[9px] text-rose-700 block uppercase">Rejected</span>
                            <span className="font-bold text-rose-800">{it.rejected_qty}</span>
                          </div>
                        </div>

                        {it.rejection_reason && (
                          <div className="p-2 rounded bg-rose-50 text-rose-800 text-[11px] border border-rose-200">
                            Rejection Cause: {it.rejection_reason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900 text-white p-3.5 rounded-lg flex justify-between items-center font-mono">
                    <span className="text-slate-300">Accepted Inventory Value:</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {formatBDT(selectedGRN.items.reduce((acc, i) => acc + i.total_value_bdt, 0))}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Gate Pass Delivery Logs */}
      {activeTab === 'gate_pass' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Site Security Gate Pass & Delivery Vehicle Log</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Real-time Gate Access Control</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Gate Pass No</th>
                  <th className="px-3 py-3">Vehicle Registration</th>
                  <th className="px-3 py-3">Supplier Name</th>
                  <th className="px-3 py-3">Challan Ref</th>
                  <th className="px-3 py-3">Material Manifest</th>
                  <th className="px-3 py-3">Entry Timestamp</th>
                  <th className="px-3 py-3">Security Guard</th>
                  <th className="px-4 py-3 text-center">Premises Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gatePasses.map((gp) => (
                  <tr key={gp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-blue-900">{gp.gate_pass_number}</td>
                    <td className="px-3 py-3.5 font-mono font-bold text-slate-900">{gp.vehicle_no}</td>
                    <td className="px-3 py-3.5 font-semibold text-slate-800">{gp.supplier_name}</td>
                    <td className="px-3 py-3.5 font-mono text-[11px] text-slate-500">{gp.chalan_no}</td>
                    <td className="px-3 py-3.5 font-medium text-slate-900">{gp.material_description} ({gp.weight_or_qty})</td>
                    <td className="px-3 py-3.5 font-mono text-slate-500">{gp.entry_timestamp}</td>
                    <td className="px-3 py-3.5 text-slate-600">{gp.security_guard}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        gp.status === 'IN_PREMISES' ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {gp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Store Issue Vouchers (SIV) */}
      {activeTab === 'siv' && (
        <div className="space-y-4">
          {issueVouchers.map((siv) => (
            <div key={siv.id} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                    {siv.siv_number}
                  </span>
                  <span className="font-bold text-slate-900">Issued To: {siv.issued_to_name}</span>
                </div>
                <div className="text-xs font-mono text-slate-500">
                  <span>Task: <strong>{siv.task_reference}</strong> ({siv.issue_date})</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-700">
                  <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-1">Item Code & Description</th>
                      <th className="text-center py-1">UOM</th>
                      <th className="text-right py-1">Issue Quantity</th>
                      <th className="text-right py-1">Unit Valuation Rate</th>
                      <th className="text-right py-1">Total Issue Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {siv.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 font-sans font-medium text-slate-900">{it.item_name}</td>
                        <td className="py-2 text-center font-bold">{it.unit}</td>
                        <td className="py-2 text-right font-bold text-blue-700">{it.qty}</td>
                        <td className="py-2 text-right">৳ {it.unit_cost_bdt.toLocaleString()}</td>
                        <td className="py-2 text-right font-bold text-slate-900">৳ {it.total_cost_bdt.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg text-xs font-mono text-slate-600 border border-slate-100">
                <span>Storekeeper: <strong>{siv.storekeeper_name}</strong> | Receiver: <strong>{siv.receiver_signature_name}</strong></span>
                <span className="font-bold text-slate-900">Total: {formatBDT(siv.total_issue_value_bdt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Inter-Site Stock Transfers */}
      {activeTab === 'transfers' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Inter-Site Store Transfer Logs</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Weighted Average Cost Re-allocation</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Transfer Ref</th>
                  <th className="px-3 py-3">Origin Site</th>
                  <th className="px-3 py-3">Destination Site</th>
                  <th className="px-3 py-3">Item Transferred</th>
                  <th className="px-3 py-3 text-right">Transfer Qty</th>
                  <th className="px-3 py-3 text-right">Valuation Rate</th>
                  <th className="px-3 py-3 text-right">Total Transferred Value</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockTransfers.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-blue-900">{st.transfer_number}</td>
                    <td className="px-3 py-3.5 font-medium text-slate-900">{st.source_project_name}</td>
                    <td className="px-3 py-3.5 font-medium text-blue-900 font-bold">{st.target_project_name}</td>
                    <td className="px-3 py-3.5 font-bold text-slate-900">{st.item_name}</td>
                    <td className="px-3 py-3.5 text-right font-mono font-bold">{st.qty} {st.unit}</td>
                    <td className="px-3 py-3.5 text-right font-mono">৳ {st.valuation_rate_bdt.toLocaleString()}</td>
                    <td className="px-3 py-3.5 text-right font-mono font-bold text-slate-900">{formatBDT(st.total_transfer_bdt)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono uppercase">
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Stock Ledger & Valuation */}
      {activeTab === 'ledger' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Site Inventory Valuation Ledger (Weighted Average)</h2>
            </div>
            <span className="text-[10px] text-amber-300 font-mono">
              Total Stock Asset: {formatCompactBDT(stockLedger.reduce((acc, s) => acc + s.total_stock_value_bdt, 0))}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Item Code</th>
                  <th className="px-3 py-3">Material Description</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3 text-center">UOM</th>
                  <th className="px-3 py-3 text-right">Current Balance</th>
                  <th className="px-3 py-3 text-right">Avg Unit Cost</th>
                  <th className="px-4 py-3 text-right">Total Valuation (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockLedger.map((stk) => (
                  <tr key={stk.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-blue-900">{stk.item_code}</td>
                    <td className="px-3 py-3.5 font-bold text-slate-900">{stk.item_name}</td>
                    <td className="px-3 py-3.5 text-slate-500">{stk.category}</td>
                    <td className="px-3 py-3.5 text-center font-bold text-slate-800">{stk.unit}</td>
                    <td className="px-3 py-3.5 text-right font-mono font-bold text-slate-900">{stk.current_balance.toLocaleString()}</td>
                    <td className="px-3 py-3.5 text-right font-mono">৳ {stk.avg_unit_cost_bdt.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-blue-900">{formatBDT(stk.total_stock_value_bdt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New GRN Modal */}
      {newGRNModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveGRN} className="bg-white rounded-xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Record Incoming Goods Received Note (GRN)</h3>
              <button type="button" onClick={() => setNewGRNModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Purchase Order (PO) Ref</label>
                  <input
                    type="text"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Supplier Challan No</label>
                  <input
                    type="text"
                    value={chalanNo}
                    onChange={(e) => setChalanNo(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Registration No</label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Received Qty</label>
                  <input
                    type="number"
                    value={receivedQty}
                    onChange={(e) => setReceivedQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-emerald-700 mb-1">Accepted Qty</label>
                  <input
                    type="number"
                    value={acceptedQty}
                    onChange={(e) => setAcceptedQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-lg font-mono font-bold text-emerald-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-rose-700 mb-1">Rejected Qty</label>
                  <input
                    type="number"
                    value={rejectedQty}
                    onChange={(e) => setRejectedQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-rose-50 border border-rose-300 rounded-lg font-mono font-bold text-rose-900"
                  />
                </div>
              </div>

              {rejectedQty > 0 && (
                <div>
                  <label className="block font-bold text-rose-700 mb-1">Rejection Cause / Defect Notes</label>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Moisture damaged bags / bent rebars"
                    className="w-full px-3 py-2 bg-white border border-rose-300 rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setNewGRNModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-sm"
              >
                Save & Update Inventory
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
