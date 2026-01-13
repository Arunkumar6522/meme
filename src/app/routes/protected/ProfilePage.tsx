import React, { useState } from 'react';
import { User, Download, Heart, KeyRound, Trash2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { useToast } from '@/hooks/useToast';
import Modal from '@/components/ui/Modal';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [savingName, setSavingName] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);
  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const [pwdErrors, setPwdErrors] = useState<{ current?: string; next?: string; confirm?: string; general?: string }>({});
  const [deleteReason, setDeleteReason] = useState('');
  const [deletePwd, setDeletePwd] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteErrors, setDeleteErrors] = useState<{ password?: string; reason?: string; general?: string }>({});
  const [deleting, setDeleting] = useState(false);

  const stats = [
    { label: 'Downloads', value: '—', icon: Download },
    { label: 'Favorites', value: favorites.length.toString(), icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your account and view your activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="mx-auto h-20 w-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="h-20 w-20 rounded-full"
                    />
                  ) : (
                    <User className="h-10 w-10 text-orange-600" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.user_metadata?.full_name || 'User'}
                </h2>
                <p className="text-gray-600 mt-1">{user?.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <stat.icon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">{stat.label}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {favorites.slice(-4).reverse().map((id) => (
                  <div key={id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-orange-500" />
                      <span className="text-gray-900 font-medium">Favorited</span>
                      <span className="text-gray-600 ml-1">Item {id.slice(0, 6)}…</span>
                    </div>
                    <span className="text-sm text-gray-500">recent</span>
                  </div>
                ))}
                {favorites.length === 0 && (
                  <p className="text-sm text-gray-600">No recent activity yet.</p>
                )}
              </div>
            </div>

            {/* Profile settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
              <Input
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Button
                size="sm"
                loading={savingName}
                onClick={async () => {
                  if (!user?.id) return;
                  setSavingName(true);
                  try {
                    const { error: uerr } = await supabase
                      .from('users')
                      .update({ full_name: fullName.trim() || null })
                      .eq('id', user.id);
                    if (uerr) throw uerr;
                    const { error: aerr } = await supabase.auth.updateUser({
                      data: { full_name: fullName.trim() || null },
                    });
                    if (aerr) throw aerr;
                    showSuccess('Name updated', 'Profile');
                  } catch (e: any) {
                    showError(e.message || 'Failed to update name', 'Error');
                  } finally {
                    setSavingName(false);
                  }
                }}
              >
                Save name
              </Button>
            </div>

            {/* Change password */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Change password</h3>
              <Button
                size="sm"
                leftIcon={<KeyRound className="h-4 w-4" />}
                onClick={() => {
                  setPwdErrors({});
                  setCurrentPwd('');
                  setNewPwd('');
                  setConfirmPwd('');
                  setPwdModalOpen(true);
                }}
              >
                Update password
              </Button>
            </div>

            {/* Delete account */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Delete account</h3>
              </div>
              <p className="text-sm text-gray-600">
                This will open a confirmation popup. You'll enter your current password and (optional) reason.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => {
                  setDeleteErrors({});
                  setDeletePwd('');
                  setDeleteReason('');
                  setDeleteModalOpen(true);
                }}
              >
                Delete account
              </Button>
            </div>

            {/* Favorites */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Favorites</h3>
                <Button variant="outline" size="sm" onClick={() => navigate('/favorites')}>
                  View All
                </Button>
              </div>
              {favorites.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No favorites yet</p>
                  <p className="text-sm mt-1">Start exploring the library to add favorites!</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {favorites.slice(-4).reverse().map((id) => (
                    <li key={id} className="py-3 flex items-center justify-between text-sm text-gray-700">
                      <span>Item {id.slice(0, 6)}…</span>
                      <Button size="sm" variant="ghost" onClick={() => navigate('/favorites')}>
                        View
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete account modal (validated, no unwanted API calls) */}
      <Modal
        open={deleteModalOpen}
        onClose={() => {
          if (deleting) return;
          setDeleteModalOpen(false);
        }}
        title="Delete account"
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            This will submit a deletion request and sign you out. Enter your current password to confirm.
          </p>

          {deleteErrors.general && (
            <div className="rounded-md bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-800">{deleteErrors.general}</p>
            </div>
          )}

          <Input
            label="Reason (optional)"
            value={deleteReason}
            onChange={(e) => {
              setDeleteReason(e.target.value);
              if (deleteErrors.reason) setDeleteErrors((p) => ({ ...p, reason: undefined }));
            }}
            placeholder="Why are you closing the account?"
          />

          <Input
            label="Current password *"
            type="password"
            value={deletePwd}
            onChange={(e) => {
              setDeletePwd(e.target.value);
              if (deleteErrors.password) setDeleteErrors((p) => ({ ...p, password: undefined }));
            }}
            error={deleteErrors.password}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              loading={deleting}
              onClick={async () => {
                if (!user?.email) {
                  setDeleteErrors({ general: 'Not signed in.' });
                  return;
                }

                if (!deletePwd) {
                  setDeleteErrors({ password: 'Password is required.' });
                  return;
                }

                setDeleting(true);
                setDeleteErrors({});
                try {
                  // Only call re-auth when user confirms and password is present
                  const { error: signErr } = await supabase.auth.signInWithPassword({
                    email: user.email,
                    password: deletePwd,
                  });
                  if (signErr) throw signErr;

                  // Record request (server-side deletion should be implemented later)
                  await supabase.from('create_interest').insert({
                    email: user.email,
                    name: user.user_metadata?.full_name || user.email,
                    message: `Account deletion request. Reason: ${deleteReason?.trim() || 'No reason provided.'}`,
                  });

                  await signOut();
                  showSuccess('Deletion request submitted. You have been signed out.', 'Account');
                  setDeleteModalOpen(false);
                  navigate('/');
                } catch (e: any) {
                  const msg = String(e?.message || 'Failed to submit deletion request');
                  const pretty = msg.includes('Invalid login credentials') ? 'Password is incorrect.' : msg;
                  setDeleteErrors({ general: pretty });
                } finally {
                  setDeleting(false);
                }
              }}
            >
              Confirm delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Change password modal (validated, no unwanted API calls) */}
      <Modal
        open={pwdModalOpen}
        onClose={() => {
          if (changingPwd) return;
          setPwdModalOpen(false);
        }}
        title="Change password"
      >
        <div className="space-y-3">
          {pwdErrors.general && (
            <div className="rounded-md bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-800">{pwdErrors.general}</p>
            </div>
          )}

          <Input
            label="Current password *"
            type="password"
            value={currentPwd}
            onChange={(e) => {
              setCurrentPwd(e.target.value);
              if (pwdErrors.current) setPwdErrors((p) => ({ ...p, current: undefined }));
            }}
            error={pwdErrors.current}
            autoComplete="current-password"
            required
          />
          <Input
            label="New password *"
            type="password"
            value={newPwd}
            onChange={(e) => {
              setNewPwd(e.target.value);
              if (pwdErrors.next) setPwdErrors((p) => ({ ...p, next: undefined }));
            }}
            error={pwdErrors.next}
            autoComplete="new-password"
            required
          />
          <Input
            label="Confirm new password *"
            type="password"
            value={confirmPwd}
            onChange={(e) => {
              setConfirmPwd(e.target.value);
              if (pwdErrors.confirm) setPwdErrors((p) => ({ ...p, confirm: undefined }));
            }}
            error={pwdErrors.confirm}
            autoComplete="new-password"
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPwdModalOpen(false)} disabled={changingPwd}>
              Cancel
            </Button>
            <Button
              loading={changingPwd}
              onClick={async () => {
                if (!user?.email) {
                  setPwdErrors({ general: 'Not signed in.' });
                  return;
                }
                const nextErrors: typeof pwdErrors = {};
                if (!currentPwd) nextErrors.current = 'Current password is required.';
                if (!newPwd) nextErrors.next = 'New password is required.';
                if (newPwd && newPwd.length < 6) nextErrors.next = 'Password must be at least 6 characters.';
                if (!confirmPwd) nextErrors.confirm = 'Please confirm your new password.';
                if (newPwd && confirmPwd && newPwd !== confirmPwd) nextErrors.confirm = 'Passwords do not match.';
                if (Object.keys(nextErrors).length) {
                  setPwdErrors(nextErrors);
                  return;
                }

                setChangingPwd(true);
                setPwdErrors({});
                try {
                  const { error: signErr } = await supabase.auth.signInWithPassword({
                    email: user.email,
                    password: currentPwd,
                  });
                  if (signErr) throw signErr;

                  const { error } = await supabase.auth.updateUser({ password: newPwd });
                  if (error) throw error;

                  showSuccess('Password changed', 'Security');
                  setPwdModalOpen(false);
                  setCurrentPwd('');
                  setNewPwd('');
                  setConfirmPwd('');
                } catch (e: any) {
                  const msg = String(e?.message || 'Failed to change password');
                  const pretty = msg.includes('Invalid login credentials') ? 'Current password is incorrect.' : msg;
                  setPwdErrors({ general: pretty });
                } finally {
                  setChangingPwd(false);
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;