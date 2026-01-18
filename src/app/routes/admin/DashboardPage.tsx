import React, { useEffect, useState } from 'react';
import {
    Users, Music, Video, Download, Globe, TrendingUp, AlertTriangle, BarChart3, PieChart
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">

                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl p-8 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                            <p className="text-primary-100 text-lg">Monitor your meme library performance</p>
                        </div>

                        <div className="flex gap-4">
                            {/* Language Filter */}
                            <select
                                className="rounded-lg border-0 shadow-md focus:ring-2 focus:ring-white text-gray-900 font-medium px-4 py-2"
                                value={selectedLang}
                                onChange={(e) => setSelectedLang(e.target.value)}
                            >
                                <option value="">All Languages</option>
                                {languages.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>

                            {/* Media Filter */}
                            <select
                                className="rounded-lg border-0 shadow-md focus:ring-2 focus:ring-white text-gray-900 font-medium px-4 py-2"
                                value={selectedMedia}
                                onChange={(e) => setSelectedMedia(e.target.value)}
                            >
                                <option value="">All Media</option>
                                <option value="audio">Audio</option>
                                <option value="video">Video</option>
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg flex items-center gap-3 shadow-sm">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Overview Cards with Icons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white shadow-md">
                                <Music className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Items</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.metrics?.total_items || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white shadow-md">
                                <Download className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Downloads</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.metrics?.total_downloads || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white shadow-md">
                                <TrendingUp className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Views</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.metrics?.total_views || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Viewed */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="p-2 bg-primary-50 rounded-lg">
                                <Globe className="h-6 w-6 text-primary-600" />
                            </div>
                            Most Viewed Content
                        </h2>
                        <div className="space-y-4">
                            {!stats?.top_viewed?.length ? (
                                <p className="text-gray-500 italic text-center py-8">No data yet.</p>
                            ) : (
                                stats.top_viewed.map((item: any, i: number) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                                                {i + 1}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                                                        {item.media_type}
                                                    </span>
                                                    <span className="mx-1">•</span>
                                                    {item.languages?.join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 ml-4">
                                            <span className="font-bold text-primary-600 text-lg">{item.view_count}</span>
                                            <span className="text-xs text-gray-500 ml-1">views</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Top Downloaded */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Download className="h-6 w-6 text-green-600" />
                            </div>
                            Most Downloaded Content
                        </h2>
                        <div className="space-y-4">
                            {!stats?.top_downloaded?.length ? (
                                <p className="text-gray-500 italic text-center py-8">No data yet.</p>
                            ) : (
                                stats.top_downloaded.map((item: any, i: number) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                                                {i + 1}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                                                        {item.media_type}
                                                    </span>
                                                    <span className="mx-1">•</span>
                                                    {item.languages?.join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 ml-4">
                                            <span className="font-bold text-green-600 text-lg">{item.download_count}</span>
                                            <span className="text-xs text-gray-500 ml-1">saves</span>
                                        </div>
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
