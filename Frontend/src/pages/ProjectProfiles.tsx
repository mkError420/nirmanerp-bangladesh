import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  HardHat,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Scale,
  Grid3X3,
  X,
  Edit3,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  PieChart,
  FileText
} from 'lucide-react';
import { Project, ProjectStatus, SystemUser, SubProject } from '../types';
import { formatCompactBDT, formatBDT } from '../utils/financial';

interface ProjectProfilesProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  selectedProject: Project;
  setSelectedProject: (project: Project) => void;
  subProjects: SubProject[];
  currentUser: SystemUser;
  onNavigate: (tab: string) => void;
}

export const ProjectProfiles: React.FC<ProjectProfilesProps> = ({
  projects,
  setProjects,
  selectedProject,
  setSelectedProject,
  subProjects,
  currentUser,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeProfileModal, setActiveProfileModal] = useState<Project | null>(null);
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [editProjectModalOpen, setEditProjectModalOpen] = useState<Project | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // New Project Form State
  const [newCode, setNewCode] = useState(`PRJ-BD-${String(projects.length + 1).padStart(3, '0')}`);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newLandKatha, setNewLandKatha] = useState<number>(12);
  const [newBudgetBDT, setNewBudgetBDT] = useState<number>(150000000);
  const [newStatus, setNewStatus] = useState<ProjectStatus>('Under Construction');
  const [newStartDate, setNewStartDate] = useState('2026-03-01');
  const [newCompletionDate, setNewCompletionDate] = useState('2028-12-31');
  const [newManager, setNewManager] = useState('Engr. Rafiqul Islam');
  const [newUnits, setNewUnits] = useState<number>(36);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.project_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPortfolioBudget = projects.reduce((sum, p) => sum + p.estimated_budget_bdt, 0);
  const totalPortfolioSpent = projects.reduce((sum, p) => sum + p.spent_bdt, 0);
  const totalLandKatha = projects.reduce((sum, p) => sum + p.total_land_katha, 0);
  const totalUnits = projects.reduce((sum, p) => sum + p.total_units, 0);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProjectItem: Project = {
      id: projects.length + 1,
      project_code: newCode || `PRJ-BD-${projects.length + 1}`,
      project_name: newName,
      location: newLocation || 'Dhaka, Bangladesh',
      total_land_katha: Number(newLandKatha) || 10,
      total_units: Number(newUnits) || 24,
      estimated_budget_bdt: Number(newBudgetBDT) || 100000000,
      spent_bdt: 0,
      status: newStatus,
      start_date: newStartDate,
      target_completion_date: newCompletionDate,
      project_manager: newManager || 'Site Project Director'
    };

    setProjects(prev => [...prev, newProjectItem]);
    setSelectedProject(newProjectItem);
    setAddProjectModalOpen(false);

    // Reset Form
    setNewName('');
    setNewLocation('');
    setNotification(`New Project "${newProjectItem.project_name}" successfully registered and set as Active Cost Center.`);
    setTimeout(() => setNotification(null), 4500);
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProjectModalOpen) return;

    setProjects(prev => prev.map(p => p.id === editProjectModalOpen.id ? editProjectModalOpen : p));
    if (selectedProject.id === editProjectModalOpen.id) {
      setSelectedProject(editProjectModalOpen);
    }
    setEditProjectModalOpen(null);
    if (activeProfileModal && activeProfileModal.id === editProjectModalOpen.id) {
      setActiveProfileModal(editProjectModalOpen);
    }
    setNotification(`Project profile "${editProjectModalOpen.project_name}" updated.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Success Notification */}
      {notification && (
        <div className="bg-emerald-900 text-white px-4 py-3 rounded-xl border border-emerald-500/50 shadow-md flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <span className="text-[10px] text-emerald-300 font-mono">Portfolio Synced</span>
        </div>
      )}

      {/* Hero Header & Portfolio Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0b162c] to-blue-950 p-6 rounded-2xl text-white border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-semibold border border-blue-500/30">
              Super Admin Directory
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-300 text-xs">{projects.length} Active Cost Centers</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Project Profiles & Cost Center Directory</h1>
          <p className="text-xs text-slate-300">
            Centralized management suite for civil engineering projects, budget allocations, site staffing, and structural profiles.
          </p>
        </div>

        {/* Super Admin Add New Project Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setNewCode(`PRJ-BD-${String(projects.length + 1).padStart(3, '0')}`);
              setAddProjectModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project (Super Admin)</span>
          </button>
        </div>
      </div>

      {/* Portfolio Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Registered Projects</div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{projects.length} Cost Centers</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">{projects.filter(p => p.status === 'Under Construction').length} Under Active Construction</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Portfolio Budget Cap</div>
          <div className="text-2xl font-bold text-blue-900 font-mono">{formatCompactBDT(totalPortfolioBudget)}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Spent: {formatCompactBDT(totalPortfolioSpent)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Land Bank Size</div>
          <div className="text-2xl font-bold text-emerald-900 font-mono">{totalLandKatha} Katha</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Across Dhaka Prime Locations</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Unit Inventory</div>
          <div className="text-2xl font-bold text-purple-900 font-mono">{totalUnits} Units</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Apartments & Commercial Spaces</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by code, title, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            {['ALL', 'Under Construction', 'Planning', 'Handover Phase', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {status === 'ALL' ? 'All Status' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((proj) => {
          const isSelected = selectedProject.id === proj.id;
          const budgetPct = Math.min(100, Math.round((proj.spent_bdt / proj.estimated_budget_bdt) * 100));
          const projectSubProjects = subProjects.filter(sp => sp.master_project_id === proj.id);

          return (
            <div
              key={proj.id}
              className={`bg-white rounded-2xl border transition shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {proj.project_code}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    proj.status === 'Under Construction' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    proj.status === 'Handover Phase' || proj.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}>
                    {proj.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{proj.project_name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{proj.location}</span>
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-xl text-center text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Land</span>
                    <strong className="text-slate-800">{proj.total_land_katha} Katha</strong>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block">Units</span>
                    <strong className="text-slate-800">{proj.total_units} Units</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Towers</span>
                    <strong className="text-slate-800">{projectSubProjects.length || 1} Blocks</strong>
                  </div>
                </div>

                {/* Budget Utilization Meter */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Budget Incurred</span>
                    <span className="font-mono font-semibold text-slate-900">{formatCompactBDT(proj.spent_bdt)} / {formatCompactBDT(proj.estimated_budget_bdt)} ({budgetPct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        budgetPct > 90 ? 'bg-rose-500' : budgetPct > 75 ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${budgetPct}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs text-slate-500 pt-1 flex items-center justify-between border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <HardHat className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[150px]">{proj.project_manager}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Target: {proj.target_completion_date}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveProfileModal(proj)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Full Profile</span>
                </button>

                {isSelected ? (
                  <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold font-mono">
                    Active Cost Center
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedProject(proj);
                      setNotification(`Active Cost Center set to "${proj.project_name}".`);
                      setTimeout(() => setNotification(null), 4000);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL PROJECT PROFILE MODAL */}
      {activeProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {activeProfileModal.project_code}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {activeProfileModal.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{activeProfileModal.project_name}</h2>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeProfileModal.location}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveProfileModal(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable Area */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs text-slate-700">
              {/* Financial Health Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span>Cost Center Financial Ledger</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Allocated Budget</span>
                    <strong className="text-base text-slate-900 font-mono">{formatBDT(activeProfileModal.estimated_budget_bdt)}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Cost Incurred</span>
                    <strong className="text-base text-blue-800 font-mono">{formatBDT(activeProfileModal.spent_bdt)}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Remaining Balance</span>
                    <strong className="text-base text-emerald-800 font-mono">
                      {formatBDT(activeProfileModal.estimated_budget_bdt - activeProfileModal.spent_bdt)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Engineering Specs */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                  <HardHat className="w-4 h-4 text-amber-600" />
                  <span>Engineering & Key Personnel</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Project Director / Manager</span>
                    <strong className="text-sm text-slate-900">{activeProfileModal.project_manager}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Target Completion Date</span>
                    <strong className="text-sm text-slate-900">{activeProfileModal.target_completion_date}</strong>
                  </div>
                </div>
              </div>

              {/* Sub-Projects & Towers List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Grid3X3 className="w-4 h-4 text-purple-600" />
                  <span>Allocated Sub-Projects & Tower Blocks</span>
                </h3>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {subProjects.filter(sp => sp.master_project_id === activeProfileModal.id).map(sp => (
                    <div key={sp.id} className="p-3 bg-white flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[10px] text-blue-600 font-bold block">{sp.sub_project_code}</span>
                        <strong className="text-slate-900 text-xs">{sp.sub_project_name}</strong>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold block">
                          {sp.progress_pct}% Completed
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{formatCompactBDT(sp.allocated_budget_bdt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setEditProjectModalOpen(activeProfileModal);
                }}
                className="py-2 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedProject(activeProfileModal);
                    setActiveProfileModal(null);
                    setNotification(`Set "${activeProfileModal.project_name}" as active cost center.`);
                    setTimeout(() => setNotification(null), 4000);
                  }}
                  className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  Set as Active Cost Center
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUPER ADMIN ADD NEW PROJECT MODAL */}
      {addProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Create New Construction Project</h2>
                  <p className="text-xs text-slate-400">Super Admin Cost Center Registration</p>
                </div>
              </div>
              <button onClick={() => setAddProjectModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Project Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Handover Phase">Handover Phase</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Purbachal Smart Tower & Residency"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Site Location & District</label>
                <input
                  type="text"
                  placeholder="e.g. Plot 18, Sector 17, Purbachal, Dhaka"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Land Size (Katha)</label>
                  <input
                    type="number"
                    value={newLandKatha}
                    onChange={(e) => setNewLandKatha(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Total Units</label>
                  <input
                    type="number"
                    value={newUnits}
                    onChange={(e) => setNewUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Budget (BDT)</label>
                  <input
                    type="number"
                    value={newBudgetBDT}
                    onChange={(e) => setNewBudgetBDT(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    value={newCompletionDate}
                    onChange={(e) => setNewCompletionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Project Director / Manager</label>
                  <input
                    type="text"
                    value={newManager}
                    onChange={(e) => setNewManager(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-sm"
                >
                  Save & Launch Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROJECT MODAL */}
      {editProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Edit Project Profile: {editProjectModalOpen.project_code}</h2>
              <button onClick={() => setEditProjectModalOpen(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  value={editProjectModalOpen.project_name}
                  onChange={(e) => setEditProjectModalOpen({ ...editProjectModalOpen, project_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status</label>
                  <select
                    value={editProjectModalOpen.status}
                    onChange={(e) => setEditProjectModalOpen({ ...editProjectModalOpen, status: e.target.value as ProjectStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Handover Phase">Handover Phase</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Budget Cap (BDT)</label>
                  <input
                    type="number"
                    value={editProjectModalOpen.estimated_budget_bdt}
                    onChange={(e) => setEditProjectModalOpen({ ...editProjectModalOpen, estimated_budget_bdt: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditProjectModalOpen(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
