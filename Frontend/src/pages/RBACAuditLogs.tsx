import React, { useState } from 'react';
import {
  Users,
  Shield,
  KeyRound,
  History,
  Lock,
  CheckCircle,
  XCircle,
  Building,
  UserCheck,
  Search,
  Filter,
  Eye,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import {
  SystemUser,
  AuditLogEntry,
  UserRole,
  DepartmentCode
} from '../types';

interface RBACAuditLogsProps {
  users: SystemUser[];
  auditLogs: AuditLogEntry[];
  currentUser: SystemUser;
  onSwitchUserRole: (user: SystemUser) => void;
}

export const RBACAuditLogs: React.FC<RBACAuditLogsProps> = ({
  users,
  auditLogs,
  currentUser,
  onSwitchUserRole,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'users' | 'audit'>('matrix');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState<string>('ALL');

  const permissionsMatrix = [
    {
      module: '1. Departmental Workflow',
      create: ['SUPER_ADMIN', 'SITE_PROJECT_MANAGER', 'PROCUREMENT_OFFICER'],
      read: ['ALL'],
      update: ['SUPER_ADMIN', 'SITE_PROJECT_MANAGER', 'COST_ENGINEER', 'FINANCE_MANAGER'],
      delete: ['SUPER_ADMIN'],
      approve: ['SUPER_ADMIN', 'SITE_PROJECT_MANAGER', 'COST_ENGINEER', 'FINANCE_MANAGER'],
      fields: 'Budget caps, Approval remarks, Stage gate overrides'
    },
    {
      module: '2. Purchase Requisitions & POs',
      create: ['PROCUREMENT_OFFICER', 'SITE_PROJECT_MANAGER', 'STORE_KEEPER'],
      read: ['ALL'],
      update: ['PROCUREMENT_OFFICER', 'SUPER_ADMIN'],
      delete: ['SUPER_ADMIN'],
      approve: ['SUPER_ADMIN', 'SITE_PROJECT_MANAGER'],
      fields: 'Unit rates, AIT/VAT tax breakdown, Supplier bank details'
    },
    {
      module: '3. Store & Goods Received (GRN)',
      create: ['STORE_KEEPER', 'SITE_PROJECT_MANAGER'],
      read: ['ALL'],
      update: ['STORE_KEEPER', 'SUPER_ADMIN'],
      delete: ['SUPER_ADMIN'],
      approve: ['STORE_KEEPER', 'SITE_PROJECT_MANAGER'],
      fields: 'Accepted qty, Rejected qty, Vehicle chalan number'
    },
    {
      module: '4. Subcontractor RA Billing & BoQ',
      create: ['COST_ENGINEER', 'SITE_PROJECT_MANAGER'],
      read: ['ALL'],
      update: ['COST_ENGINEER', 'SUPER_ADMIN'],
      delete: ['SUPER_ADMIN'],
      approve: ['COST_ENGINEER', 'FINANCE_MANAGER', 'SUPER_ADMIN'],
      fields: 'MB measurements, 10% retention holdback, Agro cash advance recovery'
    },
    {
      module: '5. Payroll & Disbursal (EFTN/bKash)',
      create: ['HR_OFFICER'],
      read: ['HR_OFFICER', 'FINANCE_MANAGER', 'SUPER_ADMIN'],
      update: ['HR_OFFICER', 'FINANCE_MANAGER'],
      delete: ['SUPER_ADMIN'],
      approve: ['FINANCE_MANAGER', 'SUPER_ADMIN'],
      fields: 'Gross salary, Basic pay, NID, Advance deduction, Bank A/C'
    },
    {
      module: '6. Double-Entry Accounts & 3-Way Match',
      create: ['FINANCE_MANAGER'],
      read: ['FINANCE_MANAGER', 'SUPER_ADMIN'],
      update: ['FINANCE_MANAGER', 'SUPER_ADMIN'],
      delete: ['SUPER_ADMIN'],
      approve: ['FINANCE_MANAGER', 'SUPER_ADMIN'],
      fields: 'Debit/Credit lines, CoA adjustments, 3-way match AP release'
    }
  ];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'ALL' || log.department === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Module 02
              </span>
              <h1 className="text-xl font-bold text-slate-900">Multi-User & Role-Based Permissions (RBAC)</h1>
            </div>
            <p className="text-xs text-slate-500">
              Departmental isolation, granular form-field level controls, project site filtering, and immutable audit trails.
            </p>
          </div>

          {/* Active Switcher */}
          <div className="bg-slate-900 text-white px-4 py-2.5 rounded-lg border border-slate-700 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
              {currentUser.avatarInitials}
            </div>
            <div>
              <div className="text-xs font-bold">{currentUser.name}</div>
              <div className="text-[10px] text-amber-300 font-mono">
                Active Role: {currentUser.role.replace('_', ' ')} ({currentUser.department})
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Granular Permissions Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>System Users & Role Switcher</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Immutable Audit Trail ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Granular Permissions Matrix */}
      {activeTab === 'matrix' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Granular Access Control & Field Isolation</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Enforced at API Gateway & UI Field Level</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Module Name</th>
                  <th className="px-3 py-3 text-center">Create (C)</th>
                  <th className="px-3 py-3 text-center">Read (R)</th>
                  <th className="px-3 py-3 text-center">Update (U)</th>
                  <th className="px-3 py-3 text-center">Delete (D)</th>
                  <th className="px-3 py-3 text-center">Approve (A)</th>
                  <th className="px-4 py-3">Sensitive Field Guard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionsMatrix.map((perm, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">{perm.module}</td>
                    <td className="px-3 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold">
                        {perm.create.join(', ')}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold">
                        {perm.read.join(', ')}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold">
                        {perm.update.join(', ')}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-mono font-bold">
                        {perm.delete.join(', ')}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-mono font-bold">
                        {perm.approve.join(', ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[11px] text-slate-600 font-medium">{perm.fields}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Users & Role Switcher */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((usr) => {
            const isActive = currentUser.id === usr.id;
            return (
              <div
                key={usr.id}
                className={`p-5 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-blue-500 shadow-md ring-2 ring-blue-500/30'
                    : 'bg-white border-slate-200/80 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {usr.avatarInitials}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{usr.name}</h3>
                      <p className={`text-[11px] font-mono ${isActive ? 'text-blue-300' : 'text-slate-500'}`}>{usr.email}</p>
                    </div>
                  </div>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-bold uppercase font-mono">
                      Current
                    </span>
                  )}
                </div>

                <div className={`p-2.5 rounded-lg text-xs space-y-1 font-medium mb-3 ${
                  isActive ? 'bg-slate-800/80 border border-slate-700' : 'bg-slate-50 border border-slate-200/60'
                }`}>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Role:</span>
                    <strong className="font-mono">{usr.role}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Department:</span>
                    <span>{usr.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Site Isolation:</span>
                    <span>{usr.assignedProjectIds.length} Projects Allowed</span>
                  </div>
                </div>

                <button
                  onClick={() => onSwitchUserRole(usr)}
                  disabled={isActive}
                  className={`w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-700 text-slate-300 cursor-not-allowed opacity-70'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isActive ? 'Currently Logged In' : `Switch to ${usr.role.split('_')[0]}`}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: Immutable Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden space-y-4">
          <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Immutable Audit Trail & Activity Logs</h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search user, entity, IP or action..."
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-hidden"
              />
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden"
              >
                <option value="ALL">All Depts</option>
                <option value="PURCHASE">Purchase</option>
                <option value="STORE">Store</option>
                <option value="COSTING">Costing</option>
                <option value="PROJECT">Project</option>
                <option value="ACCOUNTS">Accounts</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-3 py-3">User & Role</th>
                  <th className="px-3 py-3">Dept</th>
                  <th className="px-3 py-3">Action</th>
                  <th className="px-3 py-3">Entity Ref</th>
                  <th className="px-3 py-3">IP Address</th>
                  <th className="px-4 py-3">Change Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                    <td className="px-3 py-3">
                      <strong className="text-slate-900 block">{log.userName}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{log.userRole}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200">
                        {log.department}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        log.action === 'APPROVE' ? 'bg-emerald-100 text-emerald-800' :
                        log.action === 'CREATE' ? 'bg-blue-100 text-blue-800' :
                        log.action === 'UPDATE' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono text-[11px] font-bold text-blue-900">{log.entityId}</td>
                    <td className="px-3 py-3 font-mono text-[11px] text-slate-400">{log.ipAddress}</td>
                    <td className="px-4 py-3 text-[11px] text-slate-600">
                      {log.updatedValue}
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
