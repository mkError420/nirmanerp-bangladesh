import React, { useState } from 'react';
import {
  FolderTree,
  Calendar,
  Layers,
  Users,
  CheckCircle2,
  Clock,
  HardHat,
  TrendingUp,
  Building,
  Target,
  ChevronDown,
  ChevronRight,
  Plus
} from 'lucide-react';
import {
  Project,
  SubProject,
  ProjectMilestone,
  SiteStaffAllocation
} from '../types';
import { formatBDT, formatCompactBDT } from '../utils/financial';

interface SubProjectGanttProps {
  project: Project;
  subProjects: SubProject[];
  milestones: ProjectMilestone[];
  staffAllocations: SiteStaffAllocation[];
  onUpdateSubProjectProgress?: (subProjectId: string, progress: number) => void;
}

export const SubProjectGantt: React.FC<SubProjectGanttProps> = ({
  project,
  subProjects,
  milestones,
  staffAllocations,
  onUpdateSubProjectProgress
}) => {
  const [selectedSubProject, setSelectedSubProject] = useState<SubProject>(subProjects[0] || null);
  const [activeView, setActiveView] = useState<'hierarchy' | 'gantt' | 'allocations'>('hierarchy');

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Module 04
              </span>
              <h1 className="text-xl font-bold text-slate-900">Sub-Project Management & Hierarchy</h1>
            </div>
            <p className="text-xs text-slate-500">
              Master Project ({project.project_name}) → Sub-Projects (Tower A, Basement, Podium, MEP) → Milestones & Gantt progress.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('hierarchy')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'hierarchy' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5 inline mr-1" />
              <span>Project Hierarchy Tree</span>
            </button>
            <button
              onClick={() => setActiveView('gantt')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'gantt' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              <span>Gantt Chart Timeline</span>
            </button>
            <button
              onClick={() => setActiveView('allocations')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'allocations' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 inline mr-1" />
              <span>Site Staff Allocations</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Sub-Project Hierarchy Tree & Metadata Cards */}
      {activeView === 'hierarchy' && (
        <div className="space-y-6">
          {/* Master Project Summary Card */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[10px] font-bold">
                    MASTER PROJECT CODE: {project.project_code}
                  </span>
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">{project.status}</span>
                </div>
                <h2 className="text-lg font-bold text-white">{project.project_name}</h2>
                <p className="text-xs text-slate-400">{project.location} | Land: {project.total_land_katha} Katha | PM: {project.project_manager}</p>
              </div>

              <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-lg border border-slate-700 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Total Budget Pool</span>
                  <span className="font-bold text-white">{formatCompactBDT(project.estimated_budget_bdt)}</span>
                </div>
                <div className="h-6 w-[1px] bg-slate-700" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Incurred Cost</span>
                  <span className="font-bold text-blue-400">{formatCompactBDT(project.spent_bdt)}</span>
                </div>
                <div className="h-6 w-[1px] bg-slate-700" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Target Handover</span>
                  <span className="font-bold text-amber-300">{project.target_completion_date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subProjects.map((sub) => {
              const isSelected = selectedSubProject?.id === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubProject(sub)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-600/20'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                        {sub.sub_project_code}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 mt-1">{sub.sub_project_name}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                      sub.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {sub.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-3">{sub.scope_description}</p>

                  {/* Progress Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Physical Progress:</span>
                      <span className="text-blue-900 font-mono">{sub.progress_pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${sub.progress_pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget & Staff Details */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg text-[11px] font-medium border border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Allocated Budget</span>
                      <strong className="font-mono text-slate-800">{formatCompactBDT(sub.allocated_budget_bdt)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Incurred Cost</span>
                      <strong className="font-mono text-blue-700">{formatCompactBDT(sub.incurred_cost_bdt)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Site Engineer</span>
                      <span className="text-slate-700">{sub.assigned_engineer}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Thika Subcontractor</span>
                      <span className="text-slate-700 truncate block">{sub.assigned_subcontractor}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: Gantt Chart Timeline */}
      {activeView === 'gantt' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Interactive Gantt Timeline & Milestone Schedule</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Critical Path Method (CPM) Tracking</span>
          </div>

          <div className="p-4 space-y-4">
            <div className="space-y-3">
              {milestones.map((ms) => (
                <div key={ms.id} className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded text-[10px]">
                        {ms.id}
                      </span>
                      <h4 className="font-bold text-slate-900">{ms.title}</h4>
                      {ms.critical_path && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-bold uppercase font-mono">
                          Critical Path
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                      <span>{ms.start_date} → {ms.end_date}</span>
                      <span className="font-bold text-slate-700">({ms.duration_days} Days)</span>
                    </div>
                  </div>

                  {/* Gantt Bar Visualization */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Progress: {ms.progress_pct}%</span>
                      <span>Status: {ms.status}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden relative">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          ms.status === 'DONE' ? 'bg-emerald-600' :
                          ms.critical_path ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${ms.progress_pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Site Staff Allocations */}
      {activeView === 'allocations' && (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold tracking-wide uppercase">Site Staff Deployments & Sub-Project Allocations</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{staffAllocations.length} Active Site Allocations</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Employee Name</th>
                  <th className="px-3 py-3">Assigned Role</th>
                  <th className="px-3 py-3">Allocated Sub-Project</th>
                  <th className="px-3 py-3">Deployment Date</th>
                  <th className="px-3 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffAllocations.map((alloc) => (
                  <tr key={alloc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <HardHat className="w-3.5 h-3.5 text-blue-600" />
                      <span>{alloc.employee_name}</span>
                    </td>
                    <td className="px-3 py-3.5 font-semibold text-slate-700">{alloc.role}</td>
                    <td className="px-3 py-3.5 font-mono text-[11px] text-blue-900 font-bold">{alloc.sub_project_name}</td>
                    <td className="px-3 py-3.5 text-slate-500 font-mono">{alloc.allocation_date}</td>
                    <td className="px-3 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase font-mono">
                        Active on Site
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
