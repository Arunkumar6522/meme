import React from 'react';
import { User, Download, Heart } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

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