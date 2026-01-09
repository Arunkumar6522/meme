import React from 'react';
import { User, Settings, Download, Heart } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Downloads', value: '247', icon: Download },
    { label: 'Favorites', value: '89', icon: Heart },
    { label: 'Days Active', value: '23', icon: User },
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
                <Button variant="outline" size="sm" className="mt-4">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
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
                {[
                  { action: 'Downloaded', item: 'Bruh Sound Effect #2', time: '2 hours ago' },
                  { action: 'Favorited', item: 'Dramatic Chipmunk', time: '5 hours ago' },
                  { action: 'Downloaded', item: 'Vine Boom Sound', time: '1 day ago' },
                  { action: 'Downloaded', item: 'Sad Violin Music', time: '2 days ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-gray-900 font-medium">{activity.action}</span>
                      <span className="text-gray-600 ml-1">"{activity.item}"</span>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorites */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Favorites</h3>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No favorites yet</p>
                <p className="text-sm mt-1">Start exploring the library to add favorites!</p>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates about new memes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Download History</p>
                    <p className="text-sm text-gray-600">Keep track of downloaded memes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;