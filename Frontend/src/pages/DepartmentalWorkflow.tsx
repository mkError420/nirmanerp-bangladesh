import React, { useState } from 'react';
import {
  Workflow,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  MessageSquare,
  Smartphone,
  ShieldCheck,
  FileText,
  FileCheck2,
  Receipt,
  ShoppingCart,
  HardHat,
  ChevronRight,
  Sparkles,
  Zap,
  Building2
} from 'lucide-react';
import {
  WorkflowStage,
  StageGateApproval,
  DepartmentAlert,
  DepartmentCode
} from '../types';
import { formatCompactBDT, formatBDT } from '../utils/financial';

interface DepartmentalWorkflowProps {
  stages: WorkflowStage[];
  approvals: StageGateApproval[];
  alerts: DepartmentAlert[];
  onApproveNode: (approvalId: string, comment: string) => void;
  onRejectNode: (approvalId: string, comment: string) => void;
  onTriggerHandoff: (type: 'PO_TO_GRN' | 'GRN_TO_COST' | 'RA_TO_FINANCE') => void;
  onSendSmsAlert: (targetDept: DepartmentCode, message: string) => void;
}

export const DepartmentalWorkflow: React.FC<DepartmentalWorkflowProps> = ({
  stages,
  approvals,
  alerts,
  onApproveNode,
  onRejectNode,
  onTriggerHandoff,
  onSendSmsAlert
}) => {
  const [selectedApproval, setSelectedApproval] = useState<StageGateApproval | null>(approvals[0] || null);
  const [approvalComment, setApprovalComment] = useState('');
  const [activeChainStep, setActiveChainStep] = useState<DepartmentCode>('PURCHASE');
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [smsDept, setSmsDept] = useState<DepartmentCode>('STORE');
  const [smsMsg, setSmsMsg] = useState('Urgent: 25 Ton BSRM 500W rebar batch dispatched to Purbachal Site 1.');
  const [notificationSuccess, setNotificationSuccess] = useState<string | null>(null);

  const chainNodes: { dept: DepartmentCode; label: string; icon: any; color: string; desc: string }[] = [
    { dept: 'PURCHASE', label: '1. Purchase', icon: ShoppingCart, color: 'border-blue-500 bg-blue-50/80 text-blue-900', desc: 'PRs, Vendor RFQs & PO Issuance' },
    { dept: 'STORE', label: '2. Store', icon: Building2, color: 'border-amber-500 bg-amber-50/80 text-amber-900', desc: 'Gate Pass, Challan & GRN Verification' },
    { dept: 'COSTING', label: '3. Costing', icon: FileCheck2, color: 'border-indigo-500 bg-indigo-50/80 text-indigo-900', desc: 'BoQ Valuation & MB Verification' },
    { dept: 'PROJECT', label: '4. Project', icon: HardHat, color: 'border-emerald-500 bg-emerald-50/80 text-emerald-900', desc: 'DPR, Labor Hazira & Site Execution' },
    { dept: 'ACCOUNTS', label: '5. Accounts', icon: Receipt, color: 'border-purple-500 bg-purple-50/80 text-purple-900', desc: '3-Way Match & Payment Release' },
  ];

  const handleApprove = (id: string) => {
    onApproveNode(id, approvalComment || 'Approved in sequential stage-gate workflow');
    setApprovalComment('');
    setNotificationSuccess(`Document ${id} approved & forwarded to the next department node.`);
    setTimeout(() => setNotificationSuccess(null), 4000);
  };

  const handleReject = (id: string) => {
    onRejectNode(id, approvalComment || 'Rejected during stage-gate inspection');
    setApprovalComment('');
    setNotificationSuccess(`Document ${id} rejected and returned to initiator.`);
    setTimeout(() => setNotificationSuccess(null), 4000);
  };

  const handleSendCustomSms = () => {
    if (!smsMsg.trim()) return;
    onSendSmsAlert(smsDept, smsMsg);
    setSmsModalOpen(false);
    setNotificationSuccess(`Instant SMS broadcast sent to ${smsDept} Head (+880-1711-XXXXXX).`);
    setTimeout(() => setNotificationSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      {notificationSuccess && (
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white px-4 py-3 rounded-lg border border-emerald-500/50 shadow-md flex items-center justify-between text-xs animate-fade-in font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationSuccess}</span>
          </div>
          <span className="text-[10px] text-emerald-300 font-mono">Real-time Stage Gate Synced</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Module 01
              </span>
              <h1 className="text-xl font-bold text-slate-900">Departmental Workflow Management</h1>
            </div>
            <p className="text-xs text-slate-500">
              Sequential inter-department execution chain: Purchase → Store → Costing → Project → Accounts with stage-gate signoffs and SMS triggers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSmsModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-2 border border-slate-700 shadow-xs cursor-pointer transition-all"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Broadcast SMS Alert</span>
            </button>
            <button
              onClick={() => onTriggerHandoff('PO_TO_GRN')}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-blue-200" />
              <span>Simulate Auto Data Handoff</span>
            </button>
          </div>
        </div>

        {/* Sequential Chain Visualizer */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
            <Workflow className="w-3.5 h-3.5 text-slate-500" />
            <span>Sequential Departmental Data Pipeline</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {chainNodes.map((node, idx) => {
              const Icon = node.icon;
              const isSelected = activeChainStep === node.dept;
              return (
                <div
                  key={node.dept}
                  onClick={() => setActiveChainStep(node.dept)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer relative ${
                    isSelected
                      ? `${node.color} ring-2 ring-blue-600/30 shadow-md`
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-white border border-slate-200 shadow-2xs">
                        <Icon className="w-3.5 h-3.5 text-slate-700" />
                      </div>
                      <span className="text-xs font-bold">{node.label}</span>
                    </div>
                    {idx < 4 && (
                      <ArrowRight className="hidden md:block w-3.5 h-3.5 text-slate-400 absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full border border-slate-200" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight line-clamp-2">{node.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Stage-Gate Approvals & Inter-Department Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stage Gate Approval Worklist */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold tracking-wide uppercase">Stage-Gate Approval Nodes</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold font-mono">
                  {approvals.length} Pending
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Configurable Strict Authorization Matrix</span>
            </div>

            <div className="divide-y divide-slate-100">
              {approvals.map((appr) => {
                const isSelected = selectedApproval?.id === appr.id;
                return (
                  <div
                    key={appr.id}
                    onClick={() => setSelectedApproval(appr)}
                    className={`p-4 transition-all cursor-pointer ${
                      isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {appr.documentNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-900 text-white">
                          {appr.documentType.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">({appr.department})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 font-mono">{formatBDT(appr.amountBDT)}</span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 mb-1">{appr.currentNodeTitle}</p>
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                      <span>Initiated by: <strong className="text-slate-700">{appr.requestedBy}</strong></span>
                      <span className="text-[10px] font-mono text-slate-400">{appr.submissionDate}</span>
                    </div>

                    {appr.remarks && (
                      <div className="mt-2 text-[11px] bg-slate-100/80 p-2 rounded text-slate-600 border border-slate-200/60">
                        {appr.remarks}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Box for Selected Approval */}
            {selectedApproval && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Sign-off Node Action:
                    </span>
                    <span className="text-xs font-bold text-blue-900">{selectedApproval.currentNodeTitle}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                    Target: {selectedApproval.assignedRole}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600">Reviewer Audit Remarks & Sign-off Notes:</label>
                  <input
                    type="text"
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    placeholder="Enter compliance check note (e.g., Physical site verification verified & rates checked)..."
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleReject(selectedApproval.id)}
                    className="px-4 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg cursor-pointer transition-all"
                  >
                    Reject & Return
                  </button>
                  <button
                    onClick={() => handleApprove(selectedApproval.id)}
                    className="px-5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Move to Next Department</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Inter-Department Alert Feed */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
            <div className="p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold tracking-wide uppercase">Inter-Department Alerts</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live
              </span>
            </div>

            <div className="p-3 divide-y divide-slate-100 max-h-[460px] overflow-y-auto space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                      {alert.sourceDept} → {alert.targetDept}
                    </span>
                    <span className="text-slate-400">{alert.timestamp.split(' ')[1]}</span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 leading-tight mb-1">{alert.title}</p>
                  <p className="text-[11px] text-slate-600 leading-normal mb-2">{alert.message}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Ref: <strong className="text-slate-600">{alert.documentRef}</strong></span>
                    {alert.smsDelivered && (
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold flex items-center gap-1">
                        <Smartphone className="w-2.5 h-2.5" /> SMS Sent
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Handoff Helper Box */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-200 p-4 rounded-xl border border-slate-700 shadow-md space-y-2.5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">Automated Data Handoffs</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Approved POs automatically generate pre-filled GRN records in the Site Store. Verified GRNs update the BOQ Costing Ledger and trigger double-entry GL journals instantly without manual double entry.
            </p>
            <div className="pt-1 flex flex-col gap-1.5">
              <button
                onClick={() => onTriggerHandoff('PO_TO_GRN')}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-300 text-xs py-1.5 px-3 rounded font-medium flex items-center justify-between cursor-pointer transition-all"
              >
                <span>Handoff: Approved PO → Store GRN</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onTriggerHandoff('RA_TO_FINANCE')}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-emerald-300 text-xs py-1.5 px-3 rounded font-medium flex items-center justify-between cursor-pointer transition-all"
              >
                <span>Handoff: Verified RA Bill → Accounts JV</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SMS Modal */}
      {smsModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-amber-100 text-amber-800">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Broadcast SMS Inter-Department Alert</h3>
                  <p className="text-[11px] text-slate-500">Sends instant SMS alert via Bangladesh SMS Gateway</p>
                </div>
              </div>
              <button onClick={() => setSmsModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Department Head</label>
                <select
                  value={smsDept}
                  onChange={(e) => setSmsDept(e.target.value as DepartmentCode)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800"
                >
                  <option value="PURCHASE">Procurement Head (Tariqul Islam)</option>
                  <option value="STORE">Site Storekeeper (Md. Dulal Hossain)</option>
                  <option value="COSTING">Cost Engineer (Engr. Nazmul Huda)</option>
                  <option value="PROJECT">Project Manager (Engr. Kamrul Hasan)</option>
                  <option value="ACCOUNTS">Finance Manager (Arif Elahi, ACA)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">SMS Message Content (Max 160 Chars)</label>
                <textarea
                  rows={3}
                  value={smsMsg}
                  onChange={(e) => setSmsMsg(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-mono">
                Recipient: +880-17XX-XXXXXX | Sender ID: NIRMAN-ERP
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSmsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendCustomSms}
                className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit SMS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
