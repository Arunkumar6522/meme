import React, { useEffect, useState } from 'react';
import {
    Users, Music, Video, Download, Globe, TrendingUp, AlertTriangle
} from 'lucide-react';
import { DatabaseService } from '@/services/database.service';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [selectedLang, setSelectedLang] = useState<string>('');
    const [selectedMedia, setSelectedMedia] = useState<string>('');

    const languages = ['Tamil', 'English', 'Malayalam', 'Kannada', 'Telugu', 'Hindi'];

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const isAdmin = await DatabaseService.isUserAdmin(user.id);
                const isSuper = await DatabaseService.isUserSuperAdmin(user.id);

                if (!isAdmin && !isSuper) {
                    setError('Unauthorized');
                    setLoading(false);
                    return;
                }

                const data = await DatabaseService.getDashboardStats(selectedLang, selectedMedia);
                if (data) {
                    setStats(data);
                } else {
                    // Fallback/Mock
                    setStats(null);
                    setError('No data returned. Ensure updated SQL script is run.');
                }
            } catch (err) {
                setError('Failed to load dashboard.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user, selectedLang, selectedMedia]);

    if (loading && !stats) return <div className="h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

                    <div className="flex gap-4">
                        {/* Language Filter */}
                        <select
                            className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            value={selectedLang}
                            onChange={(e) => setSelectedLang(e.target.value)}
                        >
                            <option value="">All Languages</option>
                            {languages.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>

                        {/* Media Filter */}
                        <select
                            className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            value={selectedMedia}
                            onChange={(e) => setSelectedMedia(e.target.value)}
                        >
                            <option value="">All Media</option>
                            <option value="audio">Audio</option>
                            <option value="video">Video</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                <Music className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Items</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.metrics?.total_items || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-full text-green-600">
                                <Download className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Downloads</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.metrics?.total_downloads || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Views</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.metrics?.total_views || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Viewed */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="h-5 w-5 text-gray-500" />
                            Most Viewed Content
                        </h2>
                        <div className="space-y-4">
                            {!stats?.top_viewed?.length ? (
                                <p className="text-gray-500 italic">No data yet.</p>
                            ) : (
                                stats.top_viewed.map((item: any, i: number) => (
                                    <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-bold text-gray-300 w-6">#{i + 1}</span>
                                            <div>
                                                <p className="font-medium text-gray-900 line-clamp-1">{item.title}</p>
                                                <p className="text-xs text-gray-500">{item.media_type} • {item.languages?.join(', ')}</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-gray-700">{item.view_count} views</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Top Downloaded */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Download className="h-5 w-5 text-gray-500" />
                            Most Downloaded Content
                        </h2>
                        <div className="space-y-4">
                            {!stats?.top_downloaded?.length ? (
                                <p className="text-gray-500 italic">No data yet.</p>
                            ) : (
                                stats.top_downloaded.map((item: any, i: number) => (
                                    <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-bold text-gray-300 w-6">#{i + 1}</span>
                                            <div>
                                                <p className="font-medium text-gray-900 line-clamp-1">{item.title}</p>
                                                <p className="text-xs text-gray-500">{item.media_type} • {item.languages?.join(', ')}</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-gray-700">{item.download_count} saves</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
