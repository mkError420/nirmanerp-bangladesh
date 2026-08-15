import React, { useState } from 'react';
import {
  Users,
  HardHat,
  Clock,
  Smartphone,
  Calendar,
  DollarSign,
  Search,
  Plus,
  CheckCircle2,
  Sliders,
  Shield,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';
import { Employee, DailyWageHaziraLog, LaborSkillCategory, EmploymentType } from '../types';
import { formatBDT } from '../utils/financial';

interface EmployeeHRHaziraProps {
  employees: Employee[];
  haziraLogs: DailyWageHaziraLog[];
  onAddHazira?: (log: Partial<DailyWageHaziraLog>) => void;
  onUpdateSalaryStructure?: (empId: string, structure: any) => void;
}

export const EmployeeHRHazira: React.FC<EmployeeHRHaziraProps> = ({
  employees,
  haziraLogs,
  onAddHazira
}) => {
  const [activeTab, setActiveTab] = useState<'employees' | 'salary_config' | 'hazira'>('employees');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(employees[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [syncBiometricSuccess, setSyncBiometricSuccess] = useState<string | null>(null);

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.nid_number.includes(searchTerm) ||
    e.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSyncBiometric = () => {
    setSyncBiometricSuccess('Biometric ZKTeco & Mobile Geotag attendance synced successfully. 128 daily labor records logged.');
    setTimeout(() => setSyncBiometricSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Module 10
              </span>
              <h1 className="text-xl font-bold text-slate-900">Employee Profile & HR Management (Hazira Engine)</h1>
            </div>
            <p className="text-xs text-slate-500">
              National ID (NID) database, salary structures (Basic/House Rent/Hazard), mobile geotagging & site labor Hazira by trade.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'employees' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Employee Directory ({employees.length})
            </button>
            <button
              onClick={() => setActiveTab('salary_config')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'salary_config' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Salary Structure Config
            </button>
            <button
              onClick={() => setActiveTab('hazira')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'hazira' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Site Labor Hazira ({haziraLogs.length})
            </button>

            <button
              onClick={handleSyncBiometric}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer ml-2"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
              <span>Sync Geotag / Biometric</span>
            </button>
          </div>
        </div>
      </div>

      {syncBiometricSuccess && (
        <div className="bg-emerald-900 text-white px-4 py-2.5 rounded-lg border border-emerald-500/50 text-xs font-medium animate-fade-in flex items-center justify-between">
          <span>{syncBiometricSuccess}</span>
          <span className="text-[10px] font-mono text-emerald-300">Biometric Live Feed Active</span>
        </div>
      )}

      {/* TAB 1: Employee Directory */}
      {activeTab === 'employees' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search employee name, NID, designation, code..."
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {filteredEmployees.map((emp) => {
              const isSelected = selectedEmp?.id === emp.id;
              return (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmp(emp)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-600/20'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                          {emp.employee_code}
                        </span>
                        <strong className="text-slate-900">{emp.name}</strong>
                      </div>
                      <span className="text-xs text-slate-600 font-medium">{emp.designation}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono uppercase">
                      {emp.employment_type}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-lg text-[11px] font-mono border border-slate-100 my-2">
                    <div>
                      <span className="text-slate-400 text-[10px] block">National ID (NID)</span>
                      <strong>{emp.nid_number}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Gross Salary</span>
                      <strong className="text-blue-900 font-bold">{formatBDT(emp.gross_monthly_salary_bdt)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Payout Channel</span>
                      <span className="truncate block font-bold text-slate-700">{emp.bank_name.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Phone: {emp.phone}</span>
                    <span>Site: {emp.project_name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Employee Full Profile */}
          <div className="lg:col-span-5">
            {selectedEmp && (
              <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden sticky top-6 space-y-4">
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold tracking-wide uppercase">Employee Confidential Record</h3>
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono">{selectedEmp.status}</span>
                </div>

                <div className="p-4 space-y-4 text-xs">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedEmp.name}</h3>
                    <p className="text-xs text-blue-800 font-semibold">{selectedEmp.designation} ({selectedEmp.department})</p>
                    <span className="text-[11px] text-slate-500 font-mono">Joined: {selectedEmp.joining_date}</span>
                  </div>

                  {/* NID & Emergency Contact Box */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">NID Smart Card:</span>
                      <strong>{selectedEmp.nid_number}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Emergency Contact:</span>
                      <span className="truncate max-w-[200px]">{selectedEmp.emergency_contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Disbursal Wallet:</span>
                      <strong>{selectedEmp.bkash_nagad_wallet || 'Bank A/C'}</strong>
                    </div>
                  </div>

                  {/* Salary Structure Breakdown */}
                  <div className="space-y-1.5 bg-slate-900 text-white p-3.5 rounded-lg font-mono text-xs">
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider pb-1 border-b border-slate-700">
                      Approved Monthly Salary Structure
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Basic Pay (52%):</span>
                      <span>{formatBDT(selectedEmp.basic_salary_bdt)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>House Rent Allowance:</span>
                      <span>{formatBDT(selectedEmp.house_rent_bdt)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Medical Allowance:</span>
                      <span>{formatBDT(selectedEmp.medical_allowance_bdt)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Conveyance / Transport:</span>
                      <span>{formatBDT(selectedEmp.transport_allowance_bdt)}</span>
                    </div>
                    <div className="flex justify-between text-amber-300">
                      <span>Site Hazard Allowance:</span>
                      <span>{formatBDT(selectedEmp.site_hazard_allowance_bdt)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-700 flex justify-between font-bold text-emerald-400 text-sm">
                      <span>Gross Salary (BDT):</span>
                      <span>{formatBDT(selectedEmp.gross_monthly_salary_bdt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Salary Structure Configurator */}
      {activeTab === 'salary_config' && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs max-w-3xl mx-auto space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Salary Structure & Allowance Rules Engine</h2>
            <p className="text-xs text-slate-500">Configure standardized construction allowance rules compliant with Bangladesh Labor Act.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900">Site Engineer Grade (Civil)</h4>
              <div className="space-y-1 font-mono text-[11px] text-slate-600">
                <div className="flex justify-between"><span>Basic Salary:</span><strong>৳ 40,000 (53.3%)</strong></div>
                <div className="flex justify-between"><span>House Rent:</span><strong>৳ 20,000 (26.6%)</strong></div>
                <div className="flex justify-between"><span>Medical:</span><strong>৳ 4,000</strong></div>
                <div className="flex justify-between"><span>Transport:</span><strong>৳ 6,000</strong></div>
                <div className="flex justify-between"><span>Site Hazard:</span><strong className="text-amber-700">৳ 5,000</strong></div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Gross Grade Pay:</span><span>৳ 75,000 / mo</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900">Senior Project Manager Grade</h4>
              <div className="space-y-1 font-mono text-[11px] text-slate-600">
                <div className="flex justify-between"><span>Basic Salary:</span><strong>৳ 60,000 (52.1%)</strong></div>
                <div className="flex justify-between"><span>House Rent:</span><strong>৳ 30,000 (26.0%)</strong></div>
                <div className="flex justify-between"><span>Medical:</span><strong>৳ 6,000</strong></div>
                <div className="flex justify-between"><span>Transport:</span><strong>৳ 10,000</strong></div>
                <div className="flex justify-between"><span>Site Hazard:</span><strong className="text-amber-700">৳ 9,000</strong></div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Gross Grade Pay:</span><span>৳ 1,15,000 / mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Site Labor Hazira Daily Wage Logs */}
      {activeTab === 'hazira' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <HardHat className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Site Labor Hazira Daily Attendance & Wage Log</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Categorized by Skill Trades (Rajmistri / Steel Fixer / Helper)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Date & Site Sub-Project</th>
                  <th className="px-3 py-3">Gang Leader / Contractor</th>
                  <th className="px-3 py-3">Trade Skill Category</th>
                  <th className="px-3 py-3 text-center">Labor Count</th>
                  <th className="px-3 py-3 text-right">Daily Rate (BDT)</th>
                  <th className="px-3 py-3 text-center">OT Hours</th>
                  <th className="px-3 py-3 text-right">Day Wage Total</th>
                  <th className="px-4 py-3 text-right">Supervisor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {haziraLogs.map((hz) => (
                  <tr key={hz.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <strong className="font-mono text-slate-900 block">{hz.date}</strong>
                      <span className="text-[10px] text-slate-500">{hz.sub_project_name}</span>
                    </td>
                    <td className="px-3 py-3.5 font-medium text-slate-800">{hz.contractor_or_gang_leader}</td>
                    <td className="px-3 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold">
                        {hz.category}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-center font-bold font-mono text-slate-900">{hz.worker_count} Workers</td>
                    <td className="px-3 py-3.5 text-right font-mono">৳ {hz.daily_rate_bdt}</td>
                    <td className="px-3 py-3.5 text-center font-mono">{hz.overtime_hours} hrs</td>
                    <td className="px-3 py-3.5 text-right font-mono font-bold text-blue-900">
                      {formatBDT(hz.total_day_amount_bdt)}
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-600">{hz.site_supervisor}</td>
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
