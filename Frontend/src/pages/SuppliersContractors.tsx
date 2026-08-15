import React, { useState } from 'react';
import {
  Truck,
  HardHat,
  Building,
  Star,
  FileCheck2,
  AlertTriangle,
  FileText,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Wallet
} from 'lucide-react';
import { Vendor, ComplianceDoc, SubcontractorTrade, VendorType } from '../types';
import { formatBDT, formatCompactBDT } from '../utils/financial';

interface SuppliersContractorsProps {
  vendors: Vendor[];
  complianceDocs: ComplianceDoc[];
  onAddVendor?: (newVendor: Partial<Vendor>) => void;
}

export const SuppliersContractors: React.FC<SuppliersContractorsProps> = ({
  vendors,
  complianceDocs,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'suppliers' | 'subcontractors' | 'compliance'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(vendors[0] || null);

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vendor_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.trade_specialization && v.trade_specialization.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeTab === 'suppliers') return matchesSearch && v.vendor_type === 'Material Supplier';
    if (activeTab === 'subcontractors') return matchesSearch && v.vendor_type === 'Subcontractor';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Module 03
              </span>
              <h1 className="text-xl font-bold text-slate-900">Supplier & Contractor Management</h1>
            </div>
            <p className="text-xs text-slate-500">
              Supplier directory, Thika subcontractor registry with trade ratings, historical ledgers, and NBR tax compliance tracking.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Vendors</span>
              <span className="font-bold text-slate-900 font-mono">{vendors.length} Active</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Retention Held</span>
              <span className="font-bold text-blue-700 font-mono">
                {formatCompactBDT(vendors.reduce((acc, v) => acc + (v.retention_held_bdt || 0), 0))}
              </span>
            </div>
            <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-amber-600 block">Expiring Licenses</span>
              <span className="font-bold text-amber-900 font-mono">
                {complianceDocs.filter(d => d.status === 'WARNING').length} Alerts
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selector & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Partners ({vendors.length})
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'suppliers' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Material Suppliers
            </button>
            <button
              onClick={() => setActiveTab('subcontractors')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'subcontractors' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Thika Subcontractors
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'compliance' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Compliance & Expiry Monitor
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendor, code, trade..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-full sm:w-64 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      {activeTab !== 'compliance' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Vendor Cards List */}
          <div className="lg:col-span-7 space-y-3">
            {filteredVendors.map((vendor) => {
              const isSelected = selectedVendor?.id === vendor.id;
              const isSubcontractor = vendor.vendor_type === 'Subcontractor';

              return (
                <div
                  key={vendor.id}
                  onClick={() => setSelectedVendor(vendor)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${
                        isSubcontractor ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isSubcontractor ? <HardHat className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{vendor.vendor_name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold border border-slate-200">
                            {vendor.vendor_code}
                          </span>
                        </div>
                        {vendor.trade_specialization && (
                          <span className="text-xs text-amber-700 font-semibold">
                            Trade: {vendor.trade_specialization}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded border border-amber-200 text-xs font-bold text-amber-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{vendor.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Financial Snapshot */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs font-medium my-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Total Billed</span>
                      <span className="font-bold text-slate-900 font-mono">{formatCompactBDT(vendor.total_billed_bdt)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Total Paid</span>
                      <span className="font-bold text-emerald-700 font-mono">{formatCompactBDT(vendor.total_paid_bdt)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Outstanding Due</span>
                      <span className="font-bold text-rose-700 font-mono">{formatCompactBDT(vendor.outstanding_balance_bdt)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {vendor.phone}
                    </span>
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                      TIN: {vendor.tin_number} | BIN: {vendor.bin_mushak_no}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Vendor Deep Ledger Profile */}
          <div className="lg:col-span-5">
            {selectedVendor && (
              <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden sticky top-6 space-y-4">
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold tracking-wide uppercase">Partner Ledger & Profile</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-900 text-blue-200 border border-blue-700 font-mono">
                    {selectedVendor.vendor_type}
                  </span>
                </div>

                <div className="p-4 space-y-4 text-xs">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{selectedVendor.vendor_name}</h2>
                    <p className="text-[11px] text-slate-500 font-mono">{selectedVendor.address}</p>
                  </div>

                  {/* Financial Ledger Box */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-3.5 rounded-lg border border-slate-700 space-y-2">
                    <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Partner Balance Summary
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-700">
                      <span className="text-slate-300">Lifetime Gross Billed:</span>
                      <span className="font-mono font-bold">{formatBDT(selectedVendor.total_billed_bdt)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-700">
                      <span className="text-slate-300">Total Settled / Paid:</span>
                      <span className="font-mono font-bold text-emerald-400">{formatBDT(selectedVendor.total_paid_bdt)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-700">
                      <span className="text-slate-300">Retention Money Held:</span>
                      <span className="font-mono font-bold text-amber-300">{formatBDT(selectedVendor.retention_held_bdt || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 font-bold">
                      <span className="text-white">Current Net Payable Due:</span>
                      <span className="font-mono text-rose-400 text-sm">{formatBDT(selectedVendor.outstanding_balance_bdt)}</span>
                    </div>
                  </div>

                  {/* Bank & Tax Parameters */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2 text-slate-700">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Banking & NBR Tax Parameters</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Bank Name</span>
                        <strong>{selectedVendor.bank_name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Account No</span>
                        <strong className="font-mono">{selectedVendor.bank_account_no}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Routing No</span>
                        <strong className="font-mono">{selectedVendor.bank_routing_no}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Credit Terms</span>
                        <strong>{selectedVendor.credit_period_days} Days Net</strong>
                      </div>
                    </div>
                  </div>

                  {/* Compliance Expiry Box */}
                  <div className="p-3 rounded-lg border border-slate-200 text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold">Trade License Expiry:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedVendor.trade_license_expiry}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold">TIN Certificate Expiry:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedVendor.tax_certificate_expiry}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold">Default AIT Deduction:</span>
                      <span className="font-mono font-bold text-blue-700">{selectedVendor.default_ait_rate_pct}% at Source</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TAB: Compliance Monitor */
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Subcontractor & Supplier Document Compliance Expiry Tracking</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Automated 30-Day Expiry Notice</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Vendor / Subcontractor</th>
                  <th className="px-3 py-3">Document Type</th>
                  <th className="px-3 py-3">License / Ref No</th>
                  <th className="px-3 py-3">Issue Date</th>
                  <th className="px-3 py-3">Expiry Date</th>
                  <th className="px-3 py-3 text-center">Compliance Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complianceDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{doc.vendorName}</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold text-[10px]">
                        {doc.docType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono text-[11px] text-slate-600">{doc.documentNumber}</td>
                    <td className="px-3 py-3 text-slate-500">{doc.issueDate}</td>
                    <td className="px-3 py-3 font-mono font-bold text-slate-800">{doc.expiryDate}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        doc.status === 'VALID' ? 'bg-emerald-100 text-emerald-800' :
                        doc.status === 'WARNING' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {doc.status === 'WARNING' ? 'Expires Soon (<60d)' : doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-blue-700 hover:text-blue-900 font-bold text-[11px] underline">
                        View Certificate
                      </button>
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
