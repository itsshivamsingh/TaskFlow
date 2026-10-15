import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { TaskFormModal } from '../tasks/TaskFormModal';

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        onCloseMobile={() => setMobileOpen(false)}
        onOpenCreateTask={() => setCreateModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Navbar
          onToggleSidebar={() => {
            if (window.innerWidth < 768) {
              setMobileOpen((prev) => !prev);
            } else {
              setCollapsed((prev) => !prev);
            }
          }}
          onOpenCreateTask={() => setCreateModalOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Add Task Modal */}
      {createModalOpen && (
        <TaskFormModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => {
            setCreateModalOpen(false);
            // Broadcast custom event so active pages refresh their data
            window.dispatchEvent(new CustomEvent('taskflow:refresh'));
          }}
        />
      )}
    </div>
  );
};
