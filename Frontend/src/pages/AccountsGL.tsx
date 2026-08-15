import React, { useState } from 'react';
import {
  BookOpenCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Building,
  DollarSign,
  Plus,
  RefreshCw,
  Search
} from 'lucide-react';
import { ChartOfAccount, GLJournal, PDCCheque, PDCStatus } from '../types';
import { formatBDT } from '../utils/financial';

interface AccountsGLProps {
  accounts: ChartOfAccount[];
  journals: GLJournal[];
  pdcCheques: PDCCheque[];
  onUpdatePdcStatus: (pdcId: number, status: PDCStatus, bounceReason?: string) => void;
}

export const AccountsGL: React.FC<AccountsGLProps> = ({
  accounts,
  journals,
  pdcCheques,
  onUpdatePdcStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'coa' | 'journals' | 'pdc'>('journals');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJournals = journals.filter((j) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      j.journal_number.toLowerCase().includes(q) ||
      j.narration.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Title & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-1 font-mono">
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>Financial Accounting Engine</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">General Ledger & Post-Dated Cheques (PDC)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-level Chart of Accounts linked to Project Cost Centers and automated double-entry GL journal stream.
          </p>
        </div>

        <div className="flex rounded bg-slate-100 p-0.5 text-xs font-mono">
          <button
            onClick={() => setActiveSubTab('journals')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer font-bold text-xs uppercase ${
              activeSubTab === 'journals' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Auto GL ({journals.length})
          </button>
          <button
            onClick={() => setActiveSubTab('pdc')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer font-bold text-xs uppercase ${
              activeSubTab === 'pdc' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PDC Cheque Manager
          </button>
          <button
            onClick={() => setActiveSubTab('coa')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer font-bold text-xs uppercase ${
              activeSubTab === 'coa' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chart of Accounts ({accounts.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'journals' && (
        /* Auto GL Journal Entries */
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Journal No or Narration..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
              />
            </div>
            <span className="text-slate-500">{filteredJournals.length} Auto-Posted Entries</span>
          </div>

          <div className="space-y-4">
            {filteredJournals.map((jn) => (
              <div key={jn.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono font-bold text-blue-600 text-sm block">{jn.journal_number}</span>
                    <p className="text-slate-700 font-medium mt-0.5">{jn.narration}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block">Date: {jn.journal_date}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {jn.source_doc_type}
                    </span>
                  </div>
                </div>

                {/* Debit & Credit Lines Table */}
                <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/60">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-[10px] text-slate-500 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Account Code & Description</th>
                        <th className="p-2.5">Remarks</th>
                        <th className="p-2.5 text-right">Debit (BDT)</th>
                        <th className="p-2.5 text-right">Credit (BDT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {jn.lines.map((line, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5">
                            <span className="font-bold text-slate-900 font-mono block">{line.account_code}</span>
                            <span className="text-[10px] text-slate-500">{line.account_name}</span>
                          </td>
                          <td className="p-2.5 text-slate-600">{line.remarks || '-'}</td>
                          <td className="p-2.5 text-right font-bold text-slate-900">
                            {line.debit > 0 ? formatBDT(line.debit) : '-'}
                          </td>
                          <td className="p-2.5 text-right font-bold text-slate-900">
                            {line.credit > 0 ? formatBDT(line.credit) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Posted By: {jn.posted_by}</span>
                  <span className="font-bold text-slate-700">Total Balanced: {formatBDT(jn.total_debit)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'pdc' && (
        /* PDC Lifecycle Manager */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Post-Dated Cheques (PDC) Status Manager</h3>
              <p className="text-xs text-slate-500">Issued → Deposited → Cleared / Bounced Life Cycle</p>
            </div>
            <span className="text-xs text-slate-500">{pdcCheques.length} Cheques Tracked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Cheque No / Bank</th>
                  <th className="p-3.5">Party Name</th>
                  <th className="p-3.5">Cheque Date</th>
                  <th className="p-3.5 text-right">Amount (BDT)</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Action Lifecycle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {pdcCheques.map((pdc) => (
                  <tr key={pdc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-slate-900 block">{pdc.cheque_number}</span>
                      <span className="text-[10px] text-slate-500 block">{pdc.bank_name}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-900 block">{pdc.party_name}</span>
                      <span className="text-[10px] text-slate-400 block">{pdc.party_type}</span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">{pdc.cheque_date}</td>
                    <td className="p-3.5 text-right font-bold text-slate-900">{formatBDT(pdc.amount_bdt)}</td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          pdc.status === 'Cleared'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pdc.status === 'Bounced'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pdc.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        {pdc.status === 'Issued' && (
                          <button
                            onClick={() => onUpdatePdcStatus(pdc.id, 'Deposited')}
                            className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[10px] font-semibold cursor-pointer"
                          >
                            Deposit
                          </button>
                        )}
                        {(pdc.status === 'Issued' || pdc.status === 'Deposited') && (
                          <>
                            <button
                              onClick={() => onUpdatePdcStatus(pdc.id, 'Cleared')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-semibold cursor-pointer"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Enter Bounce Reason (e.g. Insufficient Funds):');
                                if (reason) onUpdatePdcStatus(pdc.id, 'Bounced', reason);
                              }}
                              className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-semibold cursor-pointer"
                            >
                              Bounce
                            </button>
                          </>
                        )}
                        {pdc.status === 'Cleared' && (
                          <span className="text-[10px] text-emerald-700 font-semibold">Cleared: {pdc.clearance_date}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'coa' && (
        /* Chart of Accounts Grid */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Project Chart of Accounts Ledger</h3>
            <p className="text-xs text-slate-500">Asset, Liability, Equity, Revenue, Expense Headings</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Account Code</th>
                  <th className="p-3.5">Account Title</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5 text-right">Current Ledger Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-blue-600">{acc.account_code}</td>
                    <td className="p-3.5 font-semibold text-slate-900">{acc.account_name}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {acc.account_type}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-900 text-sm">
                      {formatBDT(acc.balance_bdt)}
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
