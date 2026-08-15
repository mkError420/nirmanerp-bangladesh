import React, { useState, useMemo } from 'react';
import {
  Building2,
  LayoutDashboard,
  Workflow,
  Shield,
  Truck,
  Calendar,
  Scale,
  FileText,
  Boxes,
  ShoppingCart,
  Building,
  Users,
  FileCheck2,
  Wallet,
  Receipt,
  TrendingUp,
  Grid3X3,
  HardHat,
  BookOpenCheck,
  Code2,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Bell,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  Search,
  PanelLeftClose,
  PanelLeft,
  Briefcase,
  Layers,
  ArrowUpRight,
  Check,
  Clock,
  Sparkles
} from 'lucide-react';
import { Project, SystemUser, DepartmentAlert } from '../types';
import { formatCompactBDT } from '../utils/financial';

interface DashboardLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  projects: Project[];
  selectedProject: Project;
  setSelectedProject: (project: Project) => void;
  currentUser: SystemUser;
  alerts: DepartmentAlert[];
  pendingApprovalsCount: number;
  onLogout: () => void;
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  badgeType?: 'danger' | 'warning' | 'info' | 'neutral';
}

interface NavGroup {
  categoryId: string;
  categoryTitle: string;
  icon: any;
  items: NavItem[];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  setCurrentTab,
  projects,
  selectedProject,
  setSelectedProject,
  currentUser,
  alerts,
  pendingApprovalsCount,
  onLogout,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [alertDrawerOpen, setAlertDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  
  // Accordion open/close state for categories
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const navigationGroups: NavGroup[] = useMemo(() => [
    {
      categoryId: 'executive',
      categoryTitle: 'Executive & Overview',
      icon: Layers,
      items: [
        { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'project-profiles', label: 'Project Directory & Profiles', icon: Building2, badge: `${projects.length} Active`, badgeType: 'info' },
        { 
          id: 'workflow', 
          label: 'Stage-Gate Approvals', 
          icon: Workflow, 
          badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Pending` : undefined,
          badgeType: 'warning' 
        },
        { id: 'analytical-reports', label: 'P&L & Financial Reports', icon: TrendingUp },
      ]
    },
    {
      categoryId: 'engineering',
      categoryTitle: 'Civil & Site Engineering',
      icon: HardHat,
      items: [
        { id: 'subproject-gantt', label: 'CPM Gantt & Schedules', icon: Calendar },
        { id: 'subcontracting-boq', label: 'Subcontracting & Master BoQ', icon: Scale },
        { id: 'dpr', label: 'Site Daily Progress (DPR)', icon: HardHat },
        { id: 'doc-library', label: 'Document & CAD Library', icon: FileText },
        { id: 'units', label: 'Unit Inventory & Sales Matrix', icon: Grid3X3 },
      ]
    },
    {
      categoryId: 'procurement',
      categoryTitle: 'Procurement & Inventory',
      icon: ShoppingCart,
      items: [
        { id: 'po-engine', label: 'Purchase Orders (PO Engine)', icon: ShoppingCart },
        { id: 'store-grn', label: 'Site Store & GRN', icon: Building },
        { id: 'product-catalog', label: 'Material Catalog & Rates', icon: Boxes },
        { id: 'suppliers', label: 'Vendors & Subcontractors', icon: Truck },
      ]
    },
    {
      categoryId: 'hr',
      categoryTitle: 'Human Capital & Payroll',
      icon: Users,
      items: [
        { id: 'employee-hr', label: 'Employee HR & Daily Hazira', icon: Users },
        { id: 'salary-sheet', label: 'Monthly Salary Sheets', icon: FileCheck2 },
        { id: 'salary-disbursal', label: 'BEFTN & MFS Disbursal', icon: Wallet },
      ]
    },
    {
      categoryId: 'finance',
      categoryTitle: 'Finance & Compliance',
      icon: Receipt,
      items: [
        { id: 'financial-accounts', label: 'Double-Entry GL Ledger', icon: Receipt },
        { id: 'tax-ait', label: 'NBR Tax & AIT Compliance', icon: BookOpenCheck },
      ]
    },
    {
      categoryId: 'admin',
      categoryTitle: 'System Administration',
      icon: Shield,
      items: [
        { id: 'rbac', label: 'RBAC & Audit Trail', icon: Shield },
        { id: 'php-code', label: 'Developer API & Schema', icon: Code2 },
      ]
    }
  ], [pendingApprovalsCount]);

  // Filter navigation items based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return navigationGroups;
    const q = searchQuery.toLowerCase();
    return navigationGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item => 
          item.label.toLowerCase().includes(q) || 
          group.categoryTitle.toLowerCase().includes(q)
        )
      }))
      .filter(group => group.items.length > 0);
  }, [navigationGroups, searchQuery]);

  const filteredProjects = useMemo(() => {
    if (!projectSearchQuery.trim()) return projects;
    const q = projectSearchQuery.toLowerCase();
    return projects.filter(p => 
      p.project_name.toLowerCase().includes(q) || 
      p.project_code.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  }, [projects, projectSearchQuery]);

  const currentTabInfo = useMemo(() => {
    for (const group of navigationGroups) {
      const match = group.items.find(i => i.id === currentTab);
      if (match) return { group: group.categoryTitle, item: match.label };
    }
    return { group: 'Enterprise', item: 'Dashboard' };
  }, [navigationGroups, currentTab]);

  const budgetUsagePct = Math.min(100, Math.round((selectedProject.spent_bdt / selectedProject.estimated_budget_bdt) * 100));

  return (
    <div className="h-screen w-screen bg-[#f8fafc] font-sans text-slate-900 flex flex-col overflow-hidden">
      {/* Top Executive Header Bar */}
      <header className="bg-[#090e17] text-slate-200 h-14 border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between shrink-0 z-30 shadow-sm">
        {/* Left: Branding & Breadcrumbs */}
        <div className="flex items-center gap-3 lg:gap-6">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Company Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 ring-1 ring-white/20">
              N
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-sm tracking-tight brand-font">NirmanERP</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-400 font-mono font-semibold border border-blue-500/30">
                  Cloud BD
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block font-normal">Civil & Real Estate Suite</span>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-800 hidden md:block" />

          {/* Dynamic Breadcrumbs */}
          <div className="hidden md:flex items-center gap-2 text-xs font-medium">
            <span className="text-slate-500">{currentTabInfo.group}</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-semibold flex items-center gap-1.5">
              {currentTabInfo.item}
            </span>
          </div>
        </div>

        {/* Right: PDC Quick Badge, Budget Gauge, Notifications & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Real-time PDC Alert Badge */}
          <div 
            onClick={() => setCurrentTab('analytical-reports')}
            className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium hover:bg-amber-500/15 cursor-pointer transition"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
            <span>2 PDCs Maturing (৳ 39.5L)</span>
          </div>

          {/* Quick Project Financial Gauge */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1 text-xs">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Budget Used ({budgetUsagePct}%)</div>
              <div className="font-mono font-semibold text-slate-200">
                {formatCompactBDT(selectedProject.spent_bdt)} <span className="text-slate-500 font-normal">/ {formatCompactBDT(selectedProject.estimated_budget_bdt)}</span>
              </div>
            </div>
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  budgetUsagePct > 90 ? 'bg-rose-500' : budgetUsagePct > 75 ? 'bg-amber-500' : 'bg-blue-500'
                }`}
                style={{ width: `${budgetUsagePct}%` }}
              />
            </div>
          </div>

          {/* Stage Gate Pending Button */}
          <button
            onClick={() => setCurrentTab('workflow')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <Workflow className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Approvals</span>
            {pendingApprovalsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-blue-700 text-[10px] font-mono font-bold">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          {/* Notifications Center Bell */}
          <div className="relative">
            <button
              onClick={() => setAlertDrawerOpen(!alertDrawerOpen)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition relative"
              title="System Alerts & Compliance Notifications"
            >
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center ring-2 ring-[#090e17]">
                  {alerts.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Drawer */}
            {alertDrawerOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                <div className="p-3.5 bg-[#090e17] border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="text-white font-semibold text-xs">Department Notifications ({alerts.length})</span>
                  </div>
                  <button 
                    onClick={() => setAlertDrawerOpen(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800 text-xs p-1">
                  {alerts.map((a) => (
                    <div key={a.id} className="p-3 hover:bg-slate-800/50 rounded-lg transition space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          a.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          a.severity === 'WARNING' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {a.source_dept}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{a.created_at}</span>
                      </div>
                      <p className="text-slate-200 text-xs font-medium leading-snug">{a.message}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 bg-[#090e17] border-t border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setCurrentTab('workflow');
                      setAlertDrawerOpen(false);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    View All Department Workflow Queues →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Framework Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Modern Left Sidebar Navigation */}
        <aside className={`hidden lg:flex flex-col bg-[#0b1120] text-slate-300 border-r border-slate-800/90 shrink-0 transition-all duration-200 z-20 ${
          sidebarCollapsed ? 'w-18' : 'w-72'
        }`}>
          {/* Active Cost Center / Project Selector */}
          <div className="p-3 border-b border-slate-800/80 bg-[#090e17]/60">
            {!sidebarCollapsed ? (
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-blue-400" />
                    <span>Cost Center</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {selectedProject.project_code}
                  </span>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                    className="w-full flex items-center justify-between bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 rounded-xl p-2.5 text-left text-xs font-semibold text-slate-100 transition shadow-sm cursor-pointer"
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-semibold text-white truncate">{selectedProject.project_name}</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">{selectedProject.location}</div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${projectDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Project Dropdown Selector Modal */}
                  {projectDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden py-1.5">
                      <div className="p-2 border-b border-slate-800">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Filter projects..."
                            value={projectSearchQuery}
                            onChange={(e) => setProjectSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>

                      <div className="max-h-60 overflow-y-auto">
                        {filteredProjects.map((proj) => {
                          const isSelected = selectedProject.id === proj.id;
                          return (
                            <button
                              key={proj.id}
                              onClick={() => {
                                setSelectedProject(proj);
                                setProjectDropdownOpen(false);
                                setProjectSearchQuery('');
                              }}
                              className={`w-full text-left px-3 py-2.5 text-xs transition flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600/20 text-white font-bold border-l-2 border-blue-500'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <div className="truncate">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-mono text-blue-400 font-semibold">{proj.project_code}</span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                                    {proj.status}
                                  </span>
                                </div>
                                <div className="truncate font-medium text-slate-200 mt-0.5">{proj.project_name}</div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-blue-400 ml-2 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      <div className="p-2 border-t border-slate-800 bg-[#090e17]">
                        <button
                          onClick={() => {
                            setCurrentTab('project-profiles');
                            setProjectDropdownOpen(false);
                          }}
                          className="w-full py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>+ Add & Manage Project Profiles</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-1">
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400 hover:text-white hover:bg-slate-800 transition"
                  title={`${selectedProject.project_code} - ${selectedProject.project_name}`}
                >
                  <Briefcase className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Menu Search (when not collapsed) */}
          {!sidebarCollapsed && (
            <div className="px-3 pt-3 pb-1">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Jump to module..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation Accordion List */}
          <nav className="p-2.5 space-y-4 flex-1 overflow-y-auto scrollbar-thin">
            {filteredGroups.map((group) => {
              const isGroupCollapsed = collapsedCategories[group.categoryId] && !searchQuery;
              return (
                <div key={group.categoryId} className="space-y-1">
                  {!sidebarCollapsed ? (
                    <button
                      onClick={() => toggleCategory(group.categoryId)}
                      className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 tracking-wider uppercase transition cursor-pointer"
                    >
                      <span>{group.categoryTitle}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isGroupCollapsed ? '-rotate-90 text-slate-600' : 'text-slate-400'}`} />
                    </button>
                  ) : (
                    <div className="h-px bg-slate-800/80 my-2 mx-1" />
                  )}

                  {!isGroupCollapsed && (
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setCurrentTab(item.id)}
                            title={sidebarCollapsed ? item.label : undefined}
                            className={`w-full flex items-center ${
                              sidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                            } rounded-xl text-xs transition cursor-pointer ${
                              isActive
                                ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                                : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                              {!sidebarCollapsed && (
                                <span className="truncate">{item.label}</span>
                              )}
                            </div>
                            {!sidebarCollapsed && item.badge && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold shrink-0 ${
                                  isActive
                                    ? 'bg-white text-blue-700'
                                    : item.badgeType === 'warning'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar Collapse Toggle Rail Button */}
          <div className="p-2 border-t border-slate-800/80 flex items-center justify-between bg-[#090e17]/40">
            {!sidebarCollapsed ? (
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 text-xs transition cursor-pointer"
              >
                <PanelLeftClose className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </button>
            ) : (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
                title="Expand Sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* User Profile & Role Info */}
          <div className="p-3 bg-[#090e17] border-t border-slate-800/80 flex items-center justify-between text-xs">
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center gap-2.5 truncate">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold flex items-center justify-center text-xs font-mono ring-1 ring-white/10 shadow-sm">
                      {currentUser.avatarInitials}
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#090e17] absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div className="truncate leading-tight">
                    <span className="text-white font-semibold block truncate text-xs">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="w-full flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold flex items-center justify-center text-xs font-mono shadow-sm">
                  {currentUser.avatarInitials}
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-80 bg-[#0b1120] text-slate-300 flex flex-col h-full z-10 shadow-2xl border-r border-slate-800">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#090e17]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    N
                  </div>
                  <span className="text-white font-bold text-sm">NirmanERP Bangladesh</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation List */}
              <nav className="p-3 space-y-4 flex-1 overflow-y-auto">
                {navigationGroups.map((group) => (
                  <div key={group.categoryId} className="space-y-1">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                      {group.categoryTitle}
                    </div>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setCurrentTab(item.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                              isActive
                                ? 'bg-blue-600 text-white font-semibold'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Mobile User Profile */}
              <div className="p-4 bg-[#090e17] border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {currentUser.avatarInitials}
                  </div>
                  <div className="truncate leading-tight">
                    <span className="text-white font-semibold block text-xs truncate">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-400 truncate block">{currentUser.role}</span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area Viewport */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[#f8fafc]">
          {/* Secondary Workspace Context Subheader */}
          <div className="bg-white border-b border-slate-200/90 px-6 py-3 hidden sm:flex items-center justify-between shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-900 font-bold text-base">{selectedProject.project_name}</span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {selectedProject.project_code}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedProject.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Location:</span>
                <strong className="text-slate-700">{selectedProject.location}</strong>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Target Handover:</span>
                <strong className="text-slate-700">{selectedProject.target_completion_date}</strong>
              </div>
            </div>
          </div>

          {/* Scrollable Children Canvas */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-[#f8fafc]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
