import React, { useState } from 'react';
import {
  Receipt,
  FileCheck2,
  Printer,
  HelpCircle,
  Building,
  CheckCircle2
} from 'lucide-react';
import { getBDAitWithholdingRate, formatBDT } from '../utils/financial';

export const TaxComplianceBD: React.FC = () => {
  const [vendorType, setVendorType] = useState('Subcontractor');
  const [hasTin, setHasTin] = useState(true);
  const [grossAmount, setGrossAmount] = useState(2500000); // 25 Lac BDT

  const applicableRate = getBDAitWithholdingRate(vendorType, hasTin);
  const aitDeduction = (grossAmount * applicableRate) / 100;
  const netPayable = grossAmount - aitDeduction;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-1 font-mono">
          <Receipt className="w-3.5 h-3.5" />
          <span>National Board of Revenue (NBR) Compliance</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Bangladesh Tax (AIT / TDS) & Mushak 6.3 VAT Center</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Automated Tax Deducted at Source (TDS) calculator governed by NBR Income Tax Act 2023.
        </p>
      </div>

      {/* Tax Matrix Data Grid */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 font-mono border-b border-slate-100 pb-2">
          NBR IT Rules 2023 Withholding Tax Rates Matrix (TDS)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-200 font-mono">
              <tr>
                <th className="p-2.5">Vendor Classification</th>
                <th className="p-2.5">With TIN / E-TIN (%)</th>
                <th className="p-2.5">Without TIN (%)</th>
                <th className="p-2.5">Applicable IT Section</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[12px] font-mono">
              <tr>
                <td className="p-2.5 font-sans font-semibold text-slate-900">Material Supplier (Rebar, Cement, Bricks)</td>
                <td className="p-2.5 text-emerald-700 font-bold">3.0%</td>
                <td className="p-2.5 text-amber-700 font-bold">5.0%</td>
                <td className="p-2.5 text-slate-500">Section 89 (Goods Supply)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-sans font-semibold text-slate-900">Subcontractor (Civil / Electrical Work)</td>
                <td className="p-2.5 text-emerald-700 font-bold">5.0%</td>
                <td className="p-2.5 text-amber-700 font-bold">7.5%</td>
                <td className="p-2.5 text-slate-500">Section 89 (Contract Execution)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-sans font-semibold text-slate-900">Equipment / Machinery Vendor</td>
                <td className="p-2.5 text-emerald-700 font-bold">5.0%</td>
                <td className="p-2.5 text-amber-700 font-bold">7.0%</td>
                <td className="p-2.5 text-slate-500">Section 90</td>
              </tr>
              <tr>
                <td className="p-2.5 font-sans font-semibold text-slate-900">Architect / Engineer Service Consultant</td>
                <td className="p-2.5 text-emerald-700 font-bold">10.0%</td>
                <td className="p-2.5 text-amber-700 font-bold">15.0%</td>
                <td className="p-2.5 text-slate-500">Section 91 (Professional Fees)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Calculator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs max-w-xl">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
          Interactive AIT Withholding Calculator
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Vendor Type</label>
            <select
              value={vendorType}
              onChange={(e) => setVendorType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
            >
              <option value="Material Supplier">Material Supplier</option>
              <option value="Subcontractor">Subcontractor</option>
              <option value="Equipment Vendor">Equipment Vendor</option>
              <option value="Service Provider">Service Provider</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasTin"
              checked={hasTin}
              onChange={(e) => setHasTin(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="hasTin" className="font-semibold text-slate-800 cursor-pointer">
              Vendor holds valid Bangladesh E-TIN Certificate
            </label>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Gross Invoice Bill Amount (BDT)</label>
            <input
              type="number"
              value={grossAmount}
              onChange={(e) => setGrossAmount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 text-sm"
            />
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2">
            <div className="flex justify-between">
              <span>Gross Invoice Value:</span>
              <strong>{formatBDT(grossAmount)}</strong>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>Applicable NBR TDS Rate:</span>
              <strong>{applicableRate}%</strong>
            </div>
            <div className="flex justify-between text-amber-400">
              <span>AIT Amount to Deposit via NBR Treasury Challan:</span>
              <strong>{formatBDT(aitDeduction)}</strong>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-blue-400 text-sm">
              <span>Net Amount Payable to Vendor:</span>
              <span>{formatBDT(netPayable)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
