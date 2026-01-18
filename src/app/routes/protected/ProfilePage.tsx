import React, { useState } from 'react';
import { User, Download, Heart, KeyRound, Trash2, Award, CheckCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { DatabaseService } from '@/services/database.service';
import { useToast } from '@/hooks/useToast';
import { isOAuthUser, getUserProvider, getUserDisplayName, getUserAvatarUrl } from '@/utils/auth';
import Modal from '@/components/ui/Modal';
import { ContributorModal } from '@/components/contributor';

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
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [downloadCount, setDownloadCount] = useState(0);
  const [isContributor, setIsContributor] = useState(false);
  const [contributorSince, setContributorSince] = useState<string | null>(null);
  const [contributorModalOpen, setContributorModalOpen] = useState(false);

  React.useEffect(() => {
    if (user) {
      const fetchData = async () => {
        // Fetch User Data
        const { data: userData } = await supabase
          .from('users')
          .select('is_premium, subscription_end_date, is_contributor, contributor_since')
          .eq('id', user.id)
          .single();
        if (userData) {
          setIsPremium(userData.is_premium || false);
          setSubscriptionEndDate(userData.subscription_end_date);
          setIsContributor(userData.is_contributor || false);
          setContributorSince(userData.contributor_since);
        }

        // Fetch Payments
        const { data: paymentData } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (paymentData) {
          setPayments(paymentData);
        }

        // Fetch Total Downloads
        const count = await DatabaseService.getUserTotalDownloads(user.id);
        setDownloadCount(count);
      };

      fetchData();
    }
  }, [user]);

  const stats = [
    { label: 'Downloads', value: downloadCount.toString(), icon: Download },
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
                <div className="mx-auto h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="h-20 w-20 rounded-full"
                    />
                  ) : (
                    <User className="h-10 w-10 text-primary-600" />
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
            {/* Subscription Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Subscription Status</h3>
                {isPremium ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Pro Active
                  </span>
                ) : (
                  <Button size="sm" onClick={() => navigate('/pro')}>
                    Upgrade to Pro
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium text-gray-900">{isPremium ? 'Pro (Ad-Free)' : 'Free'}</span>
                </div>
                {isPremium && subscriptionEndDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Expires On</span>
                    <span className="font-medium text-gray-900">
                      {new Date(subscriptionEndDate).toLocaleDateString()}
                      {new Date(subscriptionEndDate) < new Date() && <span className="text-red-600 ml-2">(Expired)</span>}
                    </span>
                  </div>
                )}
                {!isPremium && (
                  <p className="text-xs text-gray-500 mt-2">
                    Upgrade to remove ads and unlock unlimited downloads.
                  </p>
                )}
              </div>
            </div>

            {/* Contributor Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary-600" />
                  Contributor Status
                </h3>
                {isContributor ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active Contributor
                  </span>
                ) : (
                  <Button size="sm" onClick={() => setContributorModalOpen(true)}>
                    Become Contributor
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {isContributor ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <span className="font-medium text-green-600">Active</span>
                    </div>
                    {contributorSince && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Member Since</span>
                        <span className="font-medium text-gray-900">
                          {new Date(contributorSince).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Thank you for being a contributor!</strong> You can now upload content to our platform.
                        Remember to only upload content you own or have permission to share.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Become a contributor to upload and share your meme content with the community.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Benefits:</strong>
                      </p>
                      <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
                        <li>Upload memes, audio, videos, and images</li>
                        <li>Share your content with thousands of users</li>
                        <li>Build your contributor profile</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {favorites.slice(-4).reverse().map((id) => (
                  <div key={id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-primary-500" />
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
                maxLength={50}
                helperText="Max 50 characters. Letters, spaces and . ' - only."
              />
              <Button
                size="sm"
                loading={savingName}
                onClick={async () => {
                  if (!user?.id) return;
                  const trimmed = fullName.trim();
                  if (!trimmed) return showError('Full name is required.', 'Validation');
                  if (trimmed.length < 2) return showError('Full name must be at least 2 characters.', 'Validation');
                  if (trimmed.length > 50) return showError('Full name must be 50 characters or less.', 'Validation');
                  const re = /^\p{L}[\p{L}\p{M}\s.'-]*$/u;
                  if (!re.test(trimmed)) {
                    return showError("Name can only contain letters, spaces, and . ' -", 'Validation');
                  }
                  setSavingName(true);
                  try {
                    const { error: uerr } = await supabase
                      .from('users')
                      .update({ full_name: trimmed || null })
                      .eq('id', user.id);
                    if (uerr) throw uerr;
                    const { error: aerr } = await supabase.auth.updateUser({
                      data: { full_name: trimmed || null },
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

            {/* Change password - Only show for email/password users */}
            {!isOAuthUser(user) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Change password</h3>
                <Button
                  size="sm"
                  onClick={() => {
                    setPwdErrors({});
                    setCurrentPwd('');
                    setNewPwd('');
                    setConfirmPwd('');
                    setPwdModalOpen(true);
                  }}
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Update password
                </Button>
              </div>
            )}

            {/* OAuth User Info - Show provider info for OAuth users */}
            {isOAuthUser(user) && (
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 space-y-3">
                <h3 className="text-lg font-semibold text-blue-900">Account Provider</h3>
                <div className="flex items-center space-x-3">
                  {getUserProvider(user) === 'google' && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  <div>
                    <p className="text-blue-900 font-medium">
                      Signed in with {getUserProvider(user) === 'google' ? 'Google' : getUserProvider(user)}
                    </p>
                    <p className="text-blue-700 text-sm">
                      Password changes are managed through your {getUserProvider(user)} account
                    </p>
                  </div>
                </div>
              </div>
            )}

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

            {/* Payment History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
              {payments.length === 0 ? (
                <p className="text-sm text-gray-500">No payment records found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref ID</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment: any) => (
                        <tr key={payment.id}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {payment.amount} {payment.currency}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 font-mono">
                            {payment.payment_id}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Delete account modal (validated, no unwanted API calls) */}
      < Modal
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

          {/* Only show password field for email/password users */}
          {!isOAuthUser(user) && (
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
          )}

          {/* Show OAuth info for OAuth users */}
          {isOAuthUser(user) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Your account is linked to {getUserProvider(user)}.
                Account deletion will remove your data from our platform but won't affect your {getUserProvider(user)} account.
              </p>
            </div>
          )}

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

                // Only require password for email/password users
                if (!isOAuthUser(user) && !deletePwd) {
                  setDeleteErrors({ password: 'Password is required.' });
                  return;
                }

                setDeleting(true);
                setDeleteErrors({});
                try {
                  // Only re-authenticate for email/password users
                  if (!isOAuthUser(user)) {
                    const { error: signErr } = await supabase.auth.signInWithPassword({
                      email: user.email,
                      password: deletePwd,
                    });
                    if (signErr) throw signErr;
                  }

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
      </Modal >

      {/* Change password modal (validated, no unwanted API calls) */}
      < Modal
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
      </Modal >

      {/* Contributor Modal */}
      <ContributorModal
        isOpen={contributorModalOpen}
        onClose={() => setContributorModalOpen(false)}
        onSuccess={() => {
          setIsContributor(true);
          setContributorSince(new Date().toISOString());
          showSuccess('You are now a contributor!');
        }}
      />
    </div >
  );
};

export default ProfilePage;