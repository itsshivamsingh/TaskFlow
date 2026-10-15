import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Kanban,
  Calendar,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onOpenCreateTask?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
  onOpenCreateTask,
}) => {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { label: 'Kanban Board', icon: Kanban, path: '/kanban' },
    { label: 'Calendar', icon: Calendar, path: '/calendar' },
    { label: 'Profile & Settings', icon: User, path: '/profile' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 dark:border-slate-800">
            <div
              onClick={() => {
                navigate('/dashboard');
                onCloseMobile();
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                    TaskFlow
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 mt-1">
                    Workspace
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Add Button */}
          {onOpenCreateTask && (
            <div className="p-3">
              <button
                type="button"
                onClick={() => {
                  onOpenCreateTask();
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all ${
                  collapsed ? 'px-0' : 'px-4'
                }`}
                title="Create New Task"
              >
                <Plus className="w-4 h-4" />
                {!collapsed && <span>New Task</span>}
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        {!collapsed && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
            <p className="font-medium text-slate-600 dark:text-slate-400">TaskFlow v1.0.0</p>
            <p className="mt-0.5">Plan Better. Work Smarter.</p>
          </div>
        )}
      </aside>
    </>
  );
};
