import React, { useState } from 'react';
import { User, Download, Heart, KeyRound, Trash2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { useToast } from '@/hooks/useToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [savingName, setSavingName] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deletePwd, setDeletePwd] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);

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
              <Input
                label="Current password"
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
              />
              <Input
                label="New password"
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
              />
              <Input
                label="Confirm new password"
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
              />
              <Button
                size="sm"
                loading={changingPwd}
                leftIcon={<KeyRound className="h-4 w-4" />}
                onClick={async () => {
                  if (!user?.email) return showError('No email found', 'Error');
                  if (newPwd !== confirmPwd) return showError('Passwords do not match', 'Validation');
                  setChangingPwd(true);
                  try {
                    const { error: signErr } = await supabase.auth.signInWithPassword({
                      email: user.email,
                      password: currentPwd,
                    });
                    if (signErr) throw signErr;
                    const { error } = await supabase.auth.updateUser({ password: newPwd });
                    if (error) throw error;
                    showSuccess('Password changed', 'Security');
                    setCurrentPwd('');
                    setNewPwd('');
                    setConfirmPwd('');
                  } catch (e: any) {
                    showError(e.message || 'Failed to change password', 'Error');
                  } finally {
                    setChangingPwd(false);
                  }
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
                Tell us why and confirm with your password. Your data will be removed.
              </p>
              <Input
                label="Reason (optional)"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Why are you closing the account?"
              />
              <Input
                label="Password"
                type="password"
                value={deletePwd}
                onChange={(e) => setDeletePwd(e.target.value)}
              />
              <Button
                size="sm"
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
                loading={deleting}
                onClick={async () => {
                  if (!user?.email) return;
                  setDeleting(true);
                  try {
                    const { error: signErr } = await supabase.auth.signInWithPassword({
                      email: user.email,
                      password: deletePwd,
                    });
                    if (signErr) throw signErr;
                    await supabase.from('create_interest').insert({
                      email: user.email,
                      name: deleteReason ? `Account delete: ${deleteReason}` : 'Account delete request',
                      message: null,
                    });
                    // Admin-side deletion required (service role). Signing out now.
                    await supabase.auth.signOut();
                    showSuccess('Account deletion requested. You have been signed out.', 'Account');
                    navigate('/');
                  } catch (e: any) {
                    showError(e.message || 'Failed to delete account', 'Error');
                  } finally {
                    setDeleting(false);
                  }
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
    </div>
  );
};

export default ProfilePage;