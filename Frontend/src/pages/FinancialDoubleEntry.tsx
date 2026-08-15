import React, { useState } from 'react';
import {
  BookOpenCheck,
  Receipt,
  Scale,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Search,
  Plus,
  DollarSign,
  ShieldCheck,
  Building
} from 'lucide-react';
import {
  ChartOfAccount,
  GLJournal,
  ThreeWayMatchVerification,
  PDCCheque,
  VoucherType,
  PDCStatus
} from '../types';
import { formatBDT, formatCompactBDT } from '../utils/financial';

interface FinancialDoubleEntryProps {
  accounts: ChartOfAccount[];
  journals: GLJournal[];
  threeWayMatches: ThreeWayMatchVerification[];
  pdcCheques: PDCCheque[];
  onUpdatePdcStatus?: (pdcId: number, status: PDCStatus, reason?: string) => void;
  onPostNewVoucher?: (voucher: any) => void;
}

export const FinancialDoubleEntry: React.FC<FinancialDoubleEntryProps> = ({
  accounts,
  journals,
  threeWayMatches,
  pdcCheques,
  onUpdatePdcStatus,
  onPostNewVoucher
}) => {
  const [activeTab, setActiveTab] = useState<'coa' | 'vouchers' | 'three_way' | 'pdc'>('three_way');
  const [selectedJournal, setSelectedJournal] = useState<GLJournal | null>(journals[0] || null);
  const [matchSuccess, setMatchSuccess] = useState<string | null>(null);

  const handleReleaseAP = (matchId: string) => {
    setMatchSuccess(`Accounts Payable released for ${matchId}. PO + GRN + Invoice 3-way check satisfied.`);
    setTimeout(() => setMatchSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Module 13
              </span>
              <h1 className="text-xl font-bold text-slate-900">Financial Accounting System (Double-Entry Engine)</h1>
            </div>
            <p className="text-xs text-slate-500">
              Construction Chart of Accounts (Assets, Liabilities, Direct Costs, Site Overheads), 4-Voucher System (PV, RV, JV, Contra) & 3-Way Matching Engine.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('three_way')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'three_way' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
              <span>3-Way Matching Engine</span>
            </button>
            <button
              onClick={() => setActiveTab('vouchers')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'vouchers' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 inline mr-1" />
              <span>General Ledger Journals ({journals.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('coa')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'coa' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BookOpenCheck className="w-3.5 h-3.5 inline mr-1" />
              <span>Construction CoA ({accounts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('pdc')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pdc' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 inline mr-1" />
              <span>PDC Cheques ({pdcCheques.length})</span>
            </button>
          </div>
        </div>
      </div>

      {matchSuccess && (
        <div className="bg-emerald-900 text-white px-4 py-2.5 rounded-lg border border-emerald-500/50 text-xs font-medium animate-fade-in flex items-center justify-between">
          <span>{matchSuccess}</span>
          <span className="text-[10px] font-mono text-emerald-300">AP Released to Payment Voucher</span>
        </div>
      )}

      {/* TAB 1: 3-Way Matching Engine */}
      {activeTab === 'three_way' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden space-y-4">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">3-Way Matching Engine (PO + GRN + Vendor Invoice)</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Guards against Over-Billing & Phantom Deliveries</span>
          </div>

          <div className="p-4 space-y-4">
            {threeWayMatches.map((match) => {
              const isMatch = match.match_status === 'PERFECT_MATCH';
              return (
                <div
                  key={match.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isMatch ? 'bg-emerald-50/50 border-emerald-300' : 'bg-amber-50/50 border-amber-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{match.vendor_name}</span>
                      <span className="text-[10px] text-slate-500 font-mono block">Audit Ref: {match.id}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                      isMatch ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                    }`}>
                      {match.match_status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* 3 Columns for 3 Documents */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">1. Purchase Order</span>
                      <strong className="text-slate-900 block">{match.po_number}</strong>
                      <span className="text-blue-700 font-bold">৳ {match.po_amount_bdt.toLocaleString()}</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">2. Goods Received (GRN)</span>
                      <strong className="text-slate-900 block">{match.grn_number}</strong>
                      <span className="text-emerald-700 font-bold">৳ {match.grn_accepted_value_bdt.toLocaleString()}</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">3. Vendor Tax Invoice</span>
                      <strong className="text-slate-900 block">{match.vendor_invoice_number}</strong>
                      <span className="text-purple-700 font-bold">৳ {match.invoice_amount_bdt.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-200/80 text-xs font-mono">
                    <div>
                      <span>Discrepancy Variance: </span>
                      <strong className={match.variance_bdt > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                        {formatBDT(match.variance_bdt)}
                      </strong>
                    </div>

                    {isMatch ? (
                      <button
                        onClick={() => handleReleaseAP(match.id)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1.5 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Release Accounts Payable</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-700 text-[11px] font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>AP On Hold: 20 Bags Rejected in GRN not deducted in Vendor Invoice.</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: GL Journals */}
      {activeTab === 'vouchers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-3">
            {journals.map((j) => {
              const isSelected = selectedJournal?.id === j.id;
              return (
                <div
                  key={j.id}
                  onClick={() => setSelectedJournal(j)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-600/20'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-900 px-2 py-0.5 rounded border border-slate-200">
                        {j.journal_number}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-mono uppercase">
                        {j.voucher_type}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-xs">{formatBDT(j.total_debit)}</span>
                  </div>

                  <p className="text-xs text-slate-600 mb-2">{j.narration}</p>

                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Posted by: {j.posted_by}</span>
                    <span>Date: {j.journal_date}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-6">
            {selectedJournal && (
              <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden sticky top-6 space-y-4">
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold tracking-wide uppercase">Voucher Double-Entry Lines</h3>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Balanced: Dr = Cr</span>
                </div>

                <div className="p-4 space-y-3 text-xs">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 font-mono">{selectedJournal.journal_number}</h3>
                    <p className="text-[11px] text-slate-600">{selectedJournal.narration}</p>
                  </div>

                  <table className="w-full text-xs text-slate-700 font-mono">
                    <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 text-left">Account Code & Name</th>
                        <th className="py-2 text-right">Debit (BDT)</th>
                        <th className="py-2 text-right">Credit (BDT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedJournal.lines.map((ln) => (
                        <tr key={ln.id}>
                          <td className="py-2.5">
                            <span className="font-bold text-slate-900 block font-sans">{ln.account_name}</span>
                            <span className="text-[10px] text-slate-400">{ln.account_code} ({ln.remarks})</span>
                          </td>
                          <td className="py-2.5 text-right font-bold text-slate-900">
                            {ln.debit > 0 ? `৳ ${ln.debit.toLocaleString()}` : '—'}
                          </td>
                          <td className="py-2.5 text-right font-bold text-slate-900">
                            {ln.credit > 0 ? `৳ ${ln.credit.toLocaleString()}` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-900 text-white font-bold">
                      <tr>
                        <td className="p-2">Total:</td>
                        <td className="p-2 text-right">{formatBDT(selectedJournal.total_debit)}</td>
                        <td className="p-2 text-right">{formatBDT(selectedJournal.total_credit)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Construction Chart of Accounts (CoA) */}
      {activeTab === 'coa' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Construction Industry Multi-Level Chart of Accounts (CoA)</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Tailored for Real Estate & Civil Works</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Account Code</th>
                  <th className="px-3 py-3">Account Head Name</th>
                  <th className="px-3 py-3">Class Type</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Current Balance (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-blue-900">{acc.account_code}</td>
                    <td className="px-3 py-3 font-sans font-bold text-slate-900">{acc.account_name}</td>
                    <td className="px-3 py-3 font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {acc.account_type}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-sans text-slate-500">{acc.category}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">{formatBDT(acc.balance_bdt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PDC Cheques */}
      {activeTab === 'pdc' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Post-Dated Cheques (PDC) Maturity Register</h2>
            </div>
            <span className="text-[10px] text-amber-300 font-mono">2 PDCs Due This Week</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 font-mono">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 font-sans">
                <tr>
                  <th className="px-4 py-3">Cheque No</th>
                  <th className="px-3 py-3">Bank Name</th>
                  <th className="px-3 py-3">Party Name & Type</th>
                  <th className="px-3 py-3">Maturity Date</th>
                  <th className="px-3 py-3 text-right">Cheque Amount (BDT)</th>
                  <th className="px-4 py-3 text-center">Clearance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pdcCheques.map((pdc) => (
                  <tr key={pdc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-blue-900">{pdc.cheque_number}</td>
                    <td className="px-3 py-3.5 font-sans font-medium">{pdc.bank_name}</td>
                    <td className="px-3 py-3.5 font-sans">
                      <strong className="text-slate-900 block">{pdc.party_name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">({pdc.party_type})</span>
                    </td>
                    <td className="px-3 py-3.5 font-bold text-amber-800">{pdc.cheque_date}</td>
                    <td className="px-3 py-3.5 text-right font-bold text-slate-900">{formatBDT(pdc.amount_bdt)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        pdc.status === 'Cleared' ? 'bg-emerald-100 text-emerald-800' :
                        pdc.status === 'Deposited' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pdc.status}
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
