import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/userService';
import { DeleteConfirmationDialog } from '../components/common/DeleteConfirmationDialog';
import {
  User as UserIcon,
  Mail,
  Lock,
  Sun,
  Moon,
  Monitor,
  Trash2,
  LogOut,
  Save,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, updateLocalUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Account Deletion State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await userService.updateProfile({ name: name.trim() });
      updateLocalUser(res.user);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    setSavingPassword(true);
    try {
      await userService.updatePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await userService.deleteAccount();
      toast.success('Account and all associated tasks deleted.');
      await logout();
      navigate('/register');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete account');
      setDeletingAccount(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Profile & Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account credentials, preferences, and data privacy.
        </p>
      </div>

      {/* Profile Details Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>General Information</span>
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address (Read-only)</span>
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Protected credential linked to your MongoDB identity.
            </p>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm transition-all disabled:opacity-50"
          >
            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile Changes</span>
          </button>
        </form>
      </div>

      {/* Theme Preference */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <Sun className="w-5 h-5 text-amber-500" />
          <span>Interface Theme</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Choose your preferred appearance mode for the application interface.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Moon className="w-4 h-4 text-slate-400" />
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
              theme === 'system'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Monitor className="w-4 h-4 text-indigo-500" />
            <span>System Default</span>
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Security & Password</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Updating your password requires verifying your current active password.
        </p>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 8 characters with numbers & uppercase"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-sm transition-all disabled:opacity-50"
          >
            {savingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Update Password</span>
          </button>
        </form>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/40 p-6 shadow-xs">
        <h2 className="text-base font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2 mb-1">
          <ShieldAlert className="w-5 h-5" />
          <span>Danger Zone</span>
        </h2>
        <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mb-4 max-w-lg leading-relaxed">
          Deleting your account permanently wipes your user profile, all tasks, categories, and resets from MongoDB Atlas. This action is irreversible.
        </p>

        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-sm transition-all shadow-rose-600/20"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete My Account Permanently</span>
        </button>
      </div>

      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        title="Permanently Delete Account?"
        message="This will immediately delete your account and all associated tasks stored in MongoDB Atlas. Are you sure you want to proceed?"
        confirmText="Yes, Delete Everything"
        isLoading={deletingAccount}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};
