import React, { useState } from 'react';
import {
  Wallet,
  Send,
  Building,
  Smartphone,
  CheckCircle2,
  FileCheck2,
  FileText,
  Download,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { DisbursalBatch, MonthlyPayrollRecord } from '../types';
import { formatBDT, formatCompactBDT } from '../utils/financial';

interface SalaryDisbursalProps {
  batches: DisbursalBatch[];
  payrollRecords: MonthlyPayrollRecord[];
  onTriggerDisbursal?: (batchId: string) => void;
  onPostSalaryGL?: (batchId: string) => void;
}

export const SalaryDisbursal: React.FC<SalaryDisbursalProps> = ({
  batches,
  payrollRecords,
  onTriggerDisbursal,
  onPostSalaryGL
}) => {
  const [activeChannel, setActiveChannel] = useState<'BEFTN' | 'BKASH_MFS' | 'CASH'>('BEFTN');
  const [disbursalSuccess, setDisbursalSuccess] = useState<string | null>(null);

  const beftnRecords = payrollRecords.filter(r => r.payout_channel === 'BANK_BEFTN');
  const bkashRecords = payrollRecords.filter(r => r.payout_channel === 'BKASH_NAGAD');

  const handleGenerateBEFTN = () => {
    setDisbursalSuccess('Bangladesh Bank BEFTN batch transfer file generated (.txt standard format). Ready for City Bank corporate upload.');
    setTimeout(() => setDisbursalSuccess(null), 5000);
  };

  const handlePostGL = (batchId: string) => {
    if (onPostSalaryGL) onPostSalaryGL(batchId);
    setDisbursalSuccess(`Auto-Journal Voucher posted to General Ledger for Batch ${batchId}. Salary Expense debited & Bank credited.`);
    setTimeout(() => setDisbursalSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Module 12
              </span>
              <h1 className="text-xl font-bold text-slate-900">Salary Payment & Multi-Channel Disbursal</h1>
            </div>
            <p className="text-xs text-slate-500">
              Generate Bangladesh Bank BEFTN batch transfer files, bKash/Nagad corporate MFS payouts, Agro advance recovery, and automated double-entry GL posting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveChannel('BEFTN')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeChannel === 'BEFTN' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Building className="w-3.5 h-3.5 inline mr-1" />
              <span>BEFTN / EFTN Bank File</span>
            </button>
            <button
              onClick={() => setActiveChannel('BKASH_MFS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeChannel === 'BKASH_MFS' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 inline mr-1" />
              <span>bKash / Nagad MFS Payouts</span>
            </button>
          </div>
        </div>
      </div>

      {disbursalSuccess && (
        <div className="bg-emerald-900 text-white px-4 py-2.5 rounded-lg border border-emerald-500/50 text-xs font-medium animate-fade-in flex items-center justify-between">
          <span>{disbursalSuccess}</span>
          <span className="text-[10px] font-mono text-emerald-300">BEFTN / GL Synced</span>
        </div>
      )}

      {/* Main Channel Layout */}
      {activeChannel === 'BEFTN' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden space-y-4">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold tracking-wide uppercase">BEFTN Bank Batch Transfer File Generator</h2>
              </div>
              <button
                onClick={handleGenerateBEFTN}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generate BEFTN .TXT File</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Employee Name</th>
                    <th className="px-3 py-3">Bank Name</th>
                    <th className="px-3 py-3 font-mono">Account Number</th>
                    <th className="px-3 py-3 text-right">Net Salary (BDT)</th>
                    <th className="px-4 py-3 text-center">Batch Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {beftnRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-sans font-bold text-slate-900">{rec.name}</td>
                      <td className="px-3 py-3.5 font-sans">City Bank PLC / DBBL</td>
                      <td className="px-3 py-3.5 font-bold text-blue-900">1102948192001</td>
                      <td className="px-3 py-3.5 text-right font-bold text-slate-900">{formatBDT(rec.net_salary_bdt)}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                          {rec.disbursal_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: GL Posting Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4 shadow-md">
              <div className="flex items-center gap-2 text-amber-400">
                <Receipt className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Automated Double-Entry Journal Posting</h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Click below to auto-post the consolidated February 2026 salary disbursement voucher into the Chart of Accounts:
              </p>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 font-mono text-[11px] space-y-1">
                <div className="text-slate-400">Dr: 5200-SITE-SALARY-EXPENSE (৳ 2,62,200)</div>
                <div className="text-slate-400">Cr: 1020-BANK-CITY (৳ 2,40,200)</div>
                <div className="text-slate-400">Cr: 1110-SITE-ADVANCE-AGRO (৳ 15,000)</div>
                <div className="text-slate-400">Cr: 2120-AIT-TAX-PAYABLE (৳ 7,000)</div>
              </div>

              <button
                onClick={() => handlePostGL('BAT-202602-BEFTN')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Post Disbursal Voucher to GL</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* bKash MFS Payout Channel */
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">bKash / Nagad Corporate Disbursal API Batch</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Instant Mobile Wallet Settlement</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Employee Name</th>
                  <th className="px-3 py-3">Designation</th>
                  <th className="px-3 py-3 font-mono">bKash / Nagad Wallet No</th>
                  <th className="px-3 py-3 text-right">Net Payable (BDT)</th>
                  <th className="px-4 py-3 text-center">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {bkashRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-sans font-bold text-slate-900">{rec.name}</td>
                    <td className="px-3 py-3.5 font-sans text-slate-600">{rec.designation}</td>
                    <td className="px-3 py-3.5 font-bold text-rose-700">+880 1718-449922</td>
                    <td className="px-3 py-3.5 text-right font-bold text-slate-900">{formatBDT(rec.net_salary_bdt)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        {rec.disbursal_status}
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
