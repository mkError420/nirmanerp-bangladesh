import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  PackageCheck,
  Truck,
  ArrowRightLeft,
  FileSpreadsheet,
  CheckCircle2,
  X,
  Layers,
  Search
} from 'lucide-react';
import { StockLedgerItem, GRN, Project, Vendor } from '../types';
import { formatBDT } from '../utils/financial';

interface ProcurementStoreProps {
  project: Project;
  vendors: Vendor[];
  stockLedger: StockLedgerItem[];
  grns: GRN[];
  onAddGRN: (grnData: any) => void;
}

export const ProcurementStore: React.FC<ProcurementStoreProps> = ({
  project,
  vendors,
  stockLedger,
  grns,
  onAddGRN,
}) => {
  const [activeTab, setActiveTab] = useState<'stock' | 'grn'>('stock');
  const [grnModalOpen, setGrnModalOpen] = useState(false);

  // GRN Form State
  const [vendorId, setVendorId] = useState<number>(1);
  const [chalanNumber, setChalanNumber] = useState('BSRM-CHALAN-90218');
  const [vehicleNo, setVehicleNo] = useState('Dhaka Metro-TA-12-8812');
  const [itemCode, setItemCode] = useState('RM-RBR-500G');
  const [itemName, setItemName] = useState('16mm TMT Steel Rebar (BSRM 500G)');
  const [unit, setUnit] = useState('Ton');
  const [qty, setQty] = useState<number>(20);
  const [unitPrice, setUnitPrice] = useState<number>(98000); // 98,000 BDT per Ton

  const handleGrnSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddGRN({
      po_id: 1,
      project_id: project.id,
      chalan_number: chalanNumber,
      vehicle_no: vehicleNo,
      site_store_keeper: 'Md. Dulal Hossain (Store Keeper)',
      items: [
        {
          item_code: itemCode,
          item_name: itemName,
          unit: unit,
          qty: qty,
          unit_price_bdt: unitPrice,
        },
      ],
    });

    setGrnModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-1 font-mono">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Site Store & Procurement Workflow</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Procurement & Site Stock Inventory Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Goods Receive Notes (GRN) from truck chalans, material balance ledger, and Material Transfer Notes (MTN).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex rounded bg-slate-100 p-0.5 text-xs font-mono">
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-bold text-xs uppercase ${
                activeTab === 'stock' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Site Stock Balance
            </button>
            <button
              onClick={() => setActiveTab('grn')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-bold text-xs uppercase ${
                activeTab === 'grn' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              GRN Log ({grns.length})
            </button>
          </div>

          <button
            onClick={() => setGrnModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center space-x-1.5 shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record GRN</span>
          </button>
        </div>
      </div>

      {activeTab === 'stock' ? (
        /* Stock Ledger Table */
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm flex flex-col">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 font-mono">Active Site Store Raw Material Ledger</h3>
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">{stockLedger.length} Items Monitored</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Item Code</th>
                  <th className="px-4 py-3">Material Description</th>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3 text-right">Current Balance</th>
                  <th className="px-4 py-3 text-right">Reorder Level</th>
                  <th className="px-4 py-3 text-center">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[12px] font-mono">
                {stockLedger.map((stock) => {
                  const isLow = stock.current_balance <= stock.reorder_level;
                  return (
                    <tr key={stock.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-blue-600">{stock.item_code}</td>
                      <td className="px-4 py-3 font-sans font-semibold text-slate-900">{stock.item_name}</td>
                      <td className="px-4 py-3 text-slate-500">{stock.unit}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        {stock.current_balance.toLocaleString()} {stock.unit}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">{stock.reorder_level} {stock.unit}</td>
                      <td className="px-4 py-3 text-center">
                        {isLow ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-700">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700">
                            Optimal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center font-bold uppercase tracking-wider px-4 font-mono">
            <span>Store Ledger Active</span>
            <span className="text-blue-600">Material Capping Engine Enforced</span>
          </div>
        </div>
      ) : (
        /* GRN Log Cards */
        <div className="space-y-4">
          {grns.map((grn) => (
            <div key={grn.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm block">{grn.grn_number}</span>
                    <span className="text-[11px] text-slate-500">Chalan #{grn.chalan_number} • Truck: {grn.vehicle_no}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {grn.status}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Date: {grn.received_date}</span>
                </div>
              </div>

              {/* GRN Items List */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Received Items & Valuation</span>
                {grn.items.map((it) => (
                  <div key={it.id} className="flex justify-between items-center font-semibold text-slate-800 text-xs">
                    <span>{it.item_description}</span>
                    <span>
                      {it.accepted_qty} {it.unit_of_measure} @ {formatBDT(it.unit_price_bdt)} ={' '}
                      <strong className="text-blue-700">{formatBDT(it.total_value_bdt)}</strong>
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Site Store Keeper: {grn.site_store_keeper}</span>
                <span className="font-mono font-semibold text-slate-700">Auto GL Journal Posted</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record GRN Modal */}
      {grnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-xs">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Record Goods Receive Note (GRN)</h3>
                <p className="text-xs text-slate-300">Vendor Truck Chalan Stock In Entry</p>
              </div>
              <button onClick={() => setGrnModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGrnSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Supplier Vendor *</label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vendor_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Truck Chalan Number *</label>
                  <input
                    type="text"
                    required
                    value={chalanNumber}
                    onChange={(e) => setChalanNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Truck Vehicle Number</label>
                  <input
                    type="text"
                    required
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Material Name *</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Received Qty</label>
                  <input
                    type="number"
                    required
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Price (BDT)</label>
                  <input
                    type="number"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex justify-between items-center text-xs">
                <span className="font-semibold text-blue-900">Total Material Valuation:</span>
                <strong className="text-blue-700 text-sm font-bold">{formatBDT(qty * unitPrice)}</strong>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGrnModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md cursor-pointer"
                >
                  Confirm Stock In & Post Auto GL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
