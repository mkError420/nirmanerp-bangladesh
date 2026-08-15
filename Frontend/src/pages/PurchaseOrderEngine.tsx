import React, { useState } from 'react';
import {
  ShoppingCart,
  FileCheck2,
  Printer,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Download,
  Eye,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import {
  PurchaseRequisition,
  PurchaseOrder,
  Vendor,
  CatalogItem,
  POLifecycleStatus
} from '../types';
import { formatBDT, formatCompactBDT } from '../utils/financial';

interface PurchaseOrderEngineProps {
  requisitions: PurchaseRequisition[];
  purchaseOrders: PurchaseOrder[];
  vendors: Vendor[];
  catalogItems: CatalogItem[];
  onConvertPRToPO?: (prId: number, vendorId: number) => void;
  onUpdatePOStatus?: (poId: number, status: POLifecycleStatus) => void;
}

export const PurchaseOrderEngine: React.FC<PurchaseOrderEngineProps> = ({
  requisitions,
  purchaseOrders,
  vendors,
  catalogItems,
  onConvertPRToPO,
  onUpdatePOStatus
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'requisitions' | 'create'>('orders');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(purchaseOrders[0] || null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

  const poLifecycleStages: POLifecycleStatus[] = [
    'Draft',
    'Under Review',
    'Approved',
    'Issued',
    'Partially Received',
    'Closed'
  ];

  const handleStatusChange = (poId: number, status: POLifecycleStatus) => {
    if (onUpdatePOStatus) onUpdatePOStatus(poId, status);
    if (selectedPO) setSelectedPO({ ...selectedPO, status });
    setStatusSuccess(`PO status updated to ${status}. Auto notifications dispatched to Vendor & Storekeeper.`);
    setTimeout(() => setStatusSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Module 08
              </span>
              <h1 className="text-xl font-bold text-slate-900">Purchase Order (PO) Engine & PR Conversion</h1>
            </div>
            <p className="text-xs text-slate-500">
              PR auto-conversion, multi-item PO creation, 6-stage lifecycle tracking, and official printable orders with digital signature placeholders.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Purchase Orders ({purchaseOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('requisitions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'requisitions' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Site Requisitions (PR) ({requisitions.length})
            </button>
          </div>
        </div>
      </div>

      {statusSuccess && (
        <div className="bg-emerald-900 text-white px-4 py-2.5 rounded-lg border border-emerald-500/50 text-xs font-medium animate-fade-in flex items-center justify-between">
          <span>{statusSuccess}</span>
          <span className="text-[10px] font-mono text-emerald-300">Live Stage Synced</span>
        </div>
      )}

      {/* TAB 1: PO List & Detailed View */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: PO Worklist */}
          <div className="lg:col-span-7 space-y-3">
            {purchaseOrders.map((po) => {
              const isSelected = selectedPO?.id === po.id;
              return (
                <div
                  key={po.id}
                  onClick={() => setSelectedPO(po)}
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
                          {po.po_number}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{po.vendor_name}</span>
                      </div>
                      {po.pr_number && (
                        <span className="text-[10px] text-slate-500 font-mono">Ref PR: {po.pr_number}</span>
                      )}
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                      po.status === 'Issued' ? 'bg-blue-100 text-blue-800' :
                      po.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {po.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-lg text-xs font-mono my-2.5 border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">PO Date</span>
                      <strong>{po.po_date}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Delivery Target</span>
                      <strong className="text-amber-700">{po.delivery_deadline}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Grand Total</span>
                      <strong className="text-slate-900">{formatCompactBDT(po.grand_total_bdt)}</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 truncate">Delivery to: {po.delivery_site_store}</p>
                </div>
              );
            })}
          </div>

          {/* Right: PO Status Lifecycle & Print Document */}
          <div className="lg:col-span-5">
            {selectedPO && (
              <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden sticky top-6 space-y-4">
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold tracking-wide uppercase">Official Purchase Order</h3>
                  </div>
                  <button
                    onClick={() => setPrintModalOpen(true)}
                    className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <Printer className="w-3 h-3" /> Official PO PDF
                  </button>
                </div>

                <div className="p-4 space-y-4 text-xs">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{selectedPO.po_number}</h3>
                    <p className="text-[11px] text-slate-500 font-mono">Vendor: {selectedPO.vendor_name}</p>
                  </div>

                  {/* 6-Stage Lifecycle Step Visualizer */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      PO Lifecycle State:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {poLifecycleStages.map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(selectedPO.id, st)}
                          className={`py-1.5 px-2 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                            selectedPO.status === st
                              ? 'bg-slate-900 text-amber-300 shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <div className="text-[10px] font-bold uppercase text-slate-500">PO Line Items</div>
                    {selectedPO.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] font-mono">
                        <div>
                          <strong className="text-slate-900">{it.item_name}</strong>
                          <span className="text-slate-500 block text-[10px]">({it.qty} {it.unit} @ ৳{it.unit_rate_bdt.toLocaleString()})</span>
                        </div>
                        <span className="font-bold text-slate-900">৳ {it.total_bdt.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Box */}
                  <div className="bg-slate-900 text-white p-3.5 rounded-lg space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal:</span>
                      <span>{formatBDT(selectedPO.subtotal_bdt)}</span>
                    </div>
                    <div className="flex justify-between text-blue-300 text-[11px]">
                      <span>AIT @ {selectedPO.ait_rate_pct}%:</span>
                      <span>{formatBDT(selectedPO.ait_amount_bdt)}</span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-700 flex justify-between font-bold text-amber-300 text-sm">
                      <span>Grand Total (BDT):</span>
                      <span>{formatBDT(selectedPO.grand_total_bdt)}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-blue-50 border border-blue-200 text-blue-900 text-[11px]">
                    Approved By: <strong>{selectedPO.approved_by || 'Engr. Mahbubur Rahman'}</strong> on {selectedPO.approval_date || '2026-02-06'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Site Requisitions (PR) Conversion */}
      {activeTab === 'requisitions' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Site Purchase Requisitions (PR) Engine</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">1-Click Convert to Multi-Item PO</span>
          </div>

          <div className="divide-y divide-slate-100">
            {requisitions.map((pr) => (
              <div key={pr.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                      {pr.pr_number}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                      pr.priority === 'Critical Site Hold' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {pr.priority}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{pr.status}</span>
                  </div>
                  <p className="text-xs text-slate-600">Created by: <strong>{pr.created_by}</strong> on {pr.requisition_date}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono pt-1">
                    <span>Items:</span>
                    {pr.items.map((it, i) => (
                      <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                        {it.item_name} ({it.req_qty} {it.unit})
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onConvertPRToPO) onConvertPRToPO(pr.id, 1);
                    setStatusSuccess(`Requisition ${pr.pr_number} auto-converted into Purchase Order.`);
                    setTimeout(() => setStatusSuccess(null), 4000);
                  }}
                  className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap self-start md:self-auto"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Generate Purchase Order</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Printable PO Modal */}
      {printModalOpen && selectedPO && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Formal Bangladesh Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-black text-slate-950 tracking-tight uppercase">NIRMAN ERP BANGLADESH</h2>
                <p className="text-[11px] text-slate-600 font-mono">Head Office: Road 11, Gulshan-1, Dhaka-1212 | BIN: 000192849-0101</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-slate-900 text-amber-300 text-[10px] font-bold font-mono uppercase">
                  OFFICIAL PURCHASE ORDER
                </span>
              </div>
              <div className="text-right font-mono text-xs">
                <p className="font-bold text-slate-900">PO No: {selectedPO.po_number}</p>
                <p className="text-slate-500">Date: {selectedPO.po_date}</p>
                <p className="text-slate-500">Due: {selectedPO.delivery_deadline}</p>
              </div>
            </div>

            {/* Vendor & Delivery Box */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Vendor / Supplier:</span>
                <strong className="text-slate-900 block">{selectedPO.vendor_name}</strong>
                <span className="text-slate-600 text-[11px]">Payment Terms: {selectedPO.payment_terms}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Delivery Site Store:</span>
                <strong className="text-slate-900 block">{selectedPO.delivery_site_store}</strong>
                <span className="text-slate-600 text-[11px]">Project: {selectedPO.project_name}</span>
              </div>
            </div>

            {/* Order Items Table */}
            <table className="w-full text-xs text-slate-800">
              <thead className="bg-slate-900 text-white text-[10px] uppercase font-bold">
                <tr>
                  <th className="p-2 text-left">SL</th>
                  <th className="p-2 text-left">Description & Spec</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-center">Unit</th>
                  <th className="p-2 text-right">Unit Rate (BDT)</th>
                  <th className="p-2 text-right">Total Amount (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {selectedPO.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-2 text-slate-400">{idx + 1}</td>
                    <td className="p-2 font-sans font-bold text-slate-900">{it.item_name}</td>
                    <td className="p-2 text-center font-bold">{it.qty}</td>
                    <td className="p-2 text-center">{it.unit}</td>
                    <td className="p-2 text-right">৳ {it.unit_rate_bdt.toLocaleString()}</td>
                    <td className="p-2 text-right font-bold">৳ {it.total_bdt.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Footer */}
            <div className="bg-slate-100 p-3 rounded-lg flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-slate-700">Total Purchase Value (BDT):</span>
              <span className="text-base font-bold text-slate-950">{formatBDT(selectedPO.grand_total_bdt)}</span>
            </div>

            {/* Digital Signature Placeholders */}
            <div className="grid grid-cols-3 gap-4 pt-6 text-center text-[10px] font-mono border-t border-slate-200">
              <div>
                <div className="h-10 border-b border-dashed border-slate-400 flex items-center justify-center text-slate-400 italic">
                  Tariqul Islam
                </div>
                <span className="text-slate-600 block mt-1">Prepared By (Procurement)</span>
              </div>
              <div>
                <div className="h-10 border-b border-dashed border-slate-400 flex items-center justify-center text-slate-400 italic">
                  Engr. Kamrul Hasan
                </div>
                <span className="text-slate-600 block mt-1">Site Manager Verified</span>
              </div>
              <div>
                <div className="h-10 border-b border-dashed border-slate-400 flex items-center justify-center text-slate-400 italic">
                  {selectedPO.approved_by || 'Engr. Mahbubur Rahman'}
                </div>
                <span className="text-slate-600 block mt-1 font-bold">Authorized Director</span>
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
                <span>Print Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
