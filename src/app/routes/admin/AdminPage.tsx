import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Upload, Users, BarChart3, Settings, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import UploadForm from '@/features/admin/UploadForm';
import { useToast } from '@/hooks/useToast';
import { createStorageBuckets } from '@/utils/createStorageBuckets';

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="upload" element={<AdminUpload />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Routes>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [checkingBuckets, setCheckingBuckets] = useState(false);
  const [bucketsStatus, setBucketsStatus] = useState<'unknown' | 'exists' | 'missing'>('unknown');

  // Check if buckets exist on mount
  useEffect(() => {
    checkBuckets();
  }, []);

  const checkBuckets = async () => {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const requiredBuckets = ['library-audio', 'library-video', 'thumbnails'];
      const existingBuckets = buckets?.map(b => b.name) || [];
      const allExist = requiredBuckets.every(name => existingBuckets.includes(name));
      setBucketsStatus(allExist ? 'exists' : 'missing');
    } catch (error) {
      setBucketsStatus('unknown');
    }
  };

  const handleCreateBuckets = async () => {
    setCheckingBuckets(true);
    try {
      const result = await createStorageBuckets();
      if (result.success) {
        showSuccess('Storage buckets created successfully!', 'Setup Complete');
        setBucketsStatus('exists');
      } else {
        showError(result.message, 'Bucket Creation');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to create buckets. Please create them manually in Supabase Dashboard.', 'Error');
    } finally {
      setCheckingBuckets(false);
      checkBuckets();
    }
  };

  const stats = [
    { label: 'Total Memes', value: '10,247', change: '+127 today' },
    { label: 'Total Users', value: '52,891', change: '+89 today' },
    { label: 'Downloads Today', value: '2,847', change: '+12% vs yesterday' },
    { label: 'Storage Used', value: '2.4 TB', change: '78% of limit' },
  ];

  const quickActions = [
    { label: 'Upload New Meme', icon: Upload, href: '/admin/upload' },
    { label: 'Manage Users', icon: Users, href: '/admin/users' },
    { label: 'View Analytics', icon: BarChart3, href: '/admin/analytics' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your meme library and monitor platform activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Storage Buckets Warning */}
      {bucketsStatus === 'missing' && (
        <div className="mb-8 rounded-md bg-yellow-50 p-4 border border-yellow-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Storage Buckets Missing
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Required storage buckets are not set up. Uploads will fail until buckets are created.</p>
                <p className="mt-1 font-mono text-xs">Required: library-audio, library-video, thumbnails</p>
              </div>
              <div className="mt-4 space-y-2">
                <Button
                  size="sm"
                  onClick={handleCreateBuckets}
                  loading={checkingBuckets}
                  disabled={checkingBuckets}
                >
                  {checkingBuckets ? 'Creating...' : 'Create Buckets Automatically'}
                </Button>
                <div className="text-xs text-yellow-600">
                  <p className="font-semibold mb-1">Or create manually:</p>
                  <p>1. Go to Supabase Dashboard → Storage</p>
                  <p>2. Click "New bucket"</p>
                  <p>3. Create: library-audio, library-video, thumbnails (all public)</p>
                  <p className="mt-2 font-semibold">Or use SQL Editor:</p>
                  <code className="block mt-1 p-2 bg-yellow-100 rounded text-xs overflow-x-auto">
                    INSERT INTO storage.buckets (id, name, public) VALUES<br/>
                    ('library-audio', 'library-audio', true),<br/>
                    ('library-video', 'library-video', true),<br/>
                    ('thumbnails', 'thumbnails', true);
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="inline-flex flex-col items-center justify-center h-auto p-4 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm font-medium mt-2">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'New user registered', user: 'john@example.com', time: '5 minutes ago' },
            { action: 'Meme uploaded', item: 'Vine Boom Sound v2', time: '12 minutes ago' },
            { action: 'High download activity', item: 'Bruh Sound Effect', time: '1 hour ago' },
            { action: 'User reported content', item: 'Inappropriate meme #123', time: '2 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.user || activity.item}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const AdminUpload: React.FC = () => {
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleUploadSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Successful!</h2>
        <p className="text-gray-600 mb-6">Your meme has been uploaded and is now available in the library.</p>
        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link to="/library">View in Library</Link>
          </Button>
          <Button variant="outline" onClick={() => setShowSuccess(false)}>
            Upload Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload New Meme</h1>
          <p className="text-gray-600">Add audio or video content to the library</p>
        </div>
      </div>
      
      <UploadForm onSuccess={handleUploadSuccess} />
    </div>
  );
};

const AdminUsers: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
    <h2 className="text-xl font-semibold text-gray-900 mb-2">User Management</h2>
    <p className="text-gray-600 mb-6">User management interface coming soon</p>
    <Button variant="outline">Coming Soon</Button>
  </div>
);

const AdminAnalytics: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
    <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h2>
    <p className="text-gray-600 mb-6">Analytics interface coming soon</p>
    <Button variant="outline">Coming Soon</Button>
  </div>
);

export default AdminPage;