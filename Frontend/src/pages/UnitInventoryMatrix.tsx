import React, { useState } from 'react';
import {
  Grid3X3,
  Filter,
  Building,
  CheckCircle,
  Clock,
  UserCheck,
  Key,
  X,
  Printer,
  DollarSign,
  Phone,
  FileText,
  Calculator,
  Search
} from 'lucide-react';
import { Unit, UnitStatus, Project } from '../types';
import { formatBDT, formatCompactBDT } from '../utils/financial';

interface UnitInventoryMatrixProps {
  project: Project;
  units: Unit[];
  onBookUnit: (unitId: number, buyerName: string, buyerPhone: string, buyerNid: string) => void;
}

export const UnitInventoryMatrix: React.FC<UnitInventoryMatrixProps> = ({
  project,
  units,
  onBookUnit,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<UnitStatus | 'All'>('All');
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<number | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [moneyReceiptModalOpen, setMoneyReceiptModalOpen] = useState(false);

  // Booking Form State
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerNid, setBuyerNid] = useState('');
  const [bookingAmountBDT, setBookingAmountBDT] = useState(500000); // 5 Lac Booking Money

  // Filter Units
  const filteredUnits = units.filter((u) => {
    if (selectedStatusFilter !== 'All' && u.status !== selectedStatusFilter) return false;
    if (selectedFloorFilter !== 'All' && u.floor_number !== Number(selectedFloorFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchUnit = u.unit_number.toLowerCase().includes(q);
      const matchBuyer = u.buyer_name?.toLowerCase().includes(q);
      if (!matchUnit && !matchBuyer) return false;
    }
    return true;
  });

  // Group units by floor
  const floorsMap = new Map<number, Unit[]>();
  filteredUnits.forEach((unit) => {
    if (!floorsMap.has(unit.floor_number)) {
      floorsMap.set(unit.floor_number, []);
    }
    floorsMap.get(unit.floor_number)!.push(unit);
  });
  const sortedFloors = Array.from(floorsMap.keys()).sort((a, b) => b - a); // Higher floors on top

  const getStatusBadge = (status: UnitStatus) => {
    switch (status) {
      case 'Available':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">Available</span>;
      case 'Booked':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">Booked</span>;
      case 'Sold':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">Sold</span>;
      case 'HandedOver':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded text-[10px] font-bold">Handed Over</span>;
    }
  };

  const getStatusCardBg = (status: UnitStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50/50 hover:bg-emerald-100/60 border-emerald-200 text-emerald-950';
      case 'Booked':
        return 'bg-amber-50/50 hover:bg-amber-100/60 border-amber-200 text-amber-950';
      case 'Sold':
        return 'bg-blue-50/50 hover:bg-blue-100/60 border-blue-200 text-blue-950';
      case 'HandedOver':
        return 'bg-purple-50/50 hover:bg-purple-100/60 border-purple-200 text-purple-950';
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit || !buyerName || !buyerPhone || !buyerNid) return;

    onBookUnit(selectedUnit.id, buyerName, buyerPhone, buyerNid);
    setBookingModalOpen(false);
    setMoneyReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-1 font-mono">
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Developer Sales Inventory</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Unit Matrix & Apartment Inventory Grid</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time visual floor plan grid for {project.project_name}. Click any unit to view pricing, book, or generate Money Receipt.
          </p>
        </div>

        {/* Quick Filter Badges Summary */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setSelectedStatusFilter('All')}
            className={`px-3 py-1 rounded border transition-all cursor-pointer text-xs font-bold uppercase ${
              selectedStatusFilter === 'All' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All ({units.length})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('Available')}
            className={`px-3 py-1 rounded border transition-all cursor-pointer text-xs font-bold uppercase ${
              selectedStatusFilter === 'Available' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Available ({units.filter(u => u.status === 'Available').length})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('Booked')}
            className={`px-3 py-1 rounded border transition-all cursor-pointer text-xs font-bold uppercase ${
              selectedStatusFilter === 'Booked' ? 'bg-amber-600 text-white border-amber-600' : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            Booked ({units.filter(u => u.status === 'Booked').length})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('Sold')}
            className={`px-3 py-1 rounded border transition-all cursor-pointer text-xs font-bold uppercase ${
              selectedStatusFilter === 'Sold' ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
            }`}
          >
            Sold ({units.filter(u => u.status === 'Sold').length})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Unit Code or Buyer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Floor Filter:</span>
          <select
            value={selectedFloorFilter}
            onChange={(e) => setSelectedFloorFilter(e.target.value === 'All' ? 'All' : Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 text-slate-800 rounded px-3 py-1.5 font-bold text-xs"
          >
            <option value="All">All Floors (1 - 12)</option>
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}th Floor
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Tower Floor Grid */}
      <div className="space-y-4">
        {sortedFloors.map((floorNum) => {
          const floorUnits = floorsMap.get(floorNum) || [];
          return (
            <div key={floorNum} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                    F{floorNum}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">{floorNum}th Floor Plan Matrix</h3>
                </div>
                <span className="text-xs text-slate-400">{floorUnits.length} Units</span>
              </div>

              {/* Responsive Grid Cells */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {floorUnits.map((unit) => (
                  <div
                    key={unit.id}
                    onClick={() => {
                      setSelectedUnit(unit);
                      if (unit.status === 'Available') {
                        setBookingModalOpen(true);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${getStatusCardBg(unit.status)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{unit.unit_number}</span>
                      {getStatusBadge(unit.status)}
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-slate-600 flex items-center justify-between">
                        <span>Size:</span>
                        <strong className="text-slate-900">{unit.size_sqft} Sft</strong>
                      </div>
                      <div className="text-slate-600 flex items-center justify-between">
                        <span>Rate:</span>
                        <span>৳ {unit.rate_per_sqft_bdt}/sft</span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-200/60 font-bold text-slate-900 text-sm flex items-center justify-between">
                        <span>Total:</span>
                        <span>{formatCompactBDT(unit.total_price_bdt)}</span>
                      </div>
                    </div>

                    {unit.buyer_name && (
                      <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-700 bg-white/70 p-1.5 rounded-lg">
                        <span className="font-semibold block truncate">👤 {unit.buyer_name}</span>
                        <span className="text-[10px] text-slate-500 block truncate">📞 {unit.buyer_phone}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Form Modal */}
      {bookingModalOpen && selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Book Apartment Unit #{selectedUnit.unit_number}</h3>
                <p className="text-xs text-slate-300">{selectedUnit.size_sqft} Sft • {formatBDT(selectedUnit.total_price_bdt)}</p>
              </div>
              <button onClick={() => setBookingModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Buyer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. Tanvir Ahmed"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+880 1711-000000"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">National ID (NID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="19902691029412"
                    value={buyerNid}
                    onChange={(e) => setBuyerNid(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Booking Money Received (BDT) *</label>
                <input
                  type="number"
                  required
                  value={bookingAmountBDT}
                  onChange={(e) => setBookingAmountBDT(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1">Standard booking money is ৳ 500,000 (5 Lac BDT).</p>
              </div>

              {/* Installment Breakdown Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-slate-800 space-y-1">
                <span className="font-bold text-blue-900 block text-[11px]">Payment Schedule Estimate</span>
                <div className="flex justify-between text-[11px]">
                  <span>Total Unit Price:</span>
                  <strong>{formatBDT(selectedUnit.total_price_bdt)}</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Down Payment (20%):</span>
                  <strong>{formatBDT(selectedUnit.total_price_bdt * 0.2)}</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Remaining 36 Installments:</span>
                  <strong>{formatBDT((selectedUnit.total_price_bdt * 0.8) / 36)} / month</strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-900/30 cursor-pointer"
                >
                  Confirm Booking & Print Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Money Receipt Modal */}
      {moneyReceiptModalOpen && selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">MONEY RECEIPT</h3>
                <p className="text-xs text-slate-500 font-medium">{project.project_name} Sales Office</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-xs text-blue-600">MR-2026-{Math.floor(1000 + Math.random() * 9000)}</span>
                <p className="text-[10px] text-slate-400">Date: {new Date().toISOString().split('T')[0]}</p>
              </div>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Received With Thanks From:</span>
                <strong className="text-slate-900">{buyerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact / NID:</span>
                <span>{buyerPhone} | NID: {buyerNid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Apartment Unit Allotted:</span>
                <strong className="text-slate-900">Unit #{selectedUnit.unit_number} ({selectedUnit.size_sqft} Sft)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sum of Taka (BDT):</span>
                <strong className="text-blue-700 text-sm">{formatBDT(bookingAmountBDT)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span>Pay Order / Online Account Transfer</span>
              </div>
            </div>

            <div className="pt-6 flex justify-between items-end text-[11px] text-slate-500">
              <div className="text-center">
                <div className="border-t border-slate-300 w-32 pt-1 font-semibold text-slate-800">Buyer Signature</div>
              </div>
              <div className="text-center">
                <div className="border-t border-slate-300 w-36 pt-1 font-semibold text-slate-800">Authorized Accounts Manager</div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-200">
              <button
                onClick={() => setMoneyReceiptModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center space-x-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
