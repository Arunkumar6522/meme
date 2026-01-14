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

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            try {
                const isAdmin = await DatabaseService.isUserAdmin(user.id);
                const isSuper = await DatabaseService.isUserSuperAdmin(user.id); // Assuming you added this

                if (!isAdmin && !isSuper) {
                    setError('Unauthorized');
                    setLoading(false);
                    return;
                }

                const data = await DatabaseService.getDashboardStats();
                if (data) {
                    setStats(data);
                } else {
                    // Mock data if RPC fails (for development/demo before SQL run)
                    setStats({
                        users: { total: 0, premium: 0, admins: 0 },
                        library: { total_items: 0, audio_count: 0, video_count: 0, total_downloads: 0 },
                        languages: {}
                    });
                    setError('Could not load detailed stats. Ensure database migration is run.');
                }
            } catch (err) {
                setError('Failed to load dashboard.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    if (loading) return <div className="h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
    if (!stats && !loading) return <div className="p-8 text-center text-red-600">Failed to load dashboard. {error}</div>;

    const statCards = [
        { label: 'Total Users', value: stats?.users?.total || 0, icon: Users, color: 'bg-blue-500' },
        { label: 'Premium Users', value: stats?.users?.premium || 0, icon: TrendingUp, color: 'bg-yellow-500' },
        { label: 'Total Audios', value: stats?.library?.audio_count || 0, icon: Music, color: 'bg-green-500' },
        { label: 'Total Videos', value: stats?.library?.video_count || 0, icon: Video, color: 'bg-red-500' },
        { label: 'Total Downloads', value: stats?.library?.total_downloads || 0, icon: Download, color: 'bg-purple-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                </div>

                {error && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {statCards.map((stat) => (
                        <div key={stat.label} className="bg-white rounded-lg shadow border border-gray-100 p-4 flex items-center space-x-4 hover:shadow-md transition-shadow">
                            <div className={`${stat.color} p-3 rounded-full text-white`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Language Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="h-5 w-5 text-gray-500" />
                            Content by Language
                        </h2>
                        <div className="space-y-4">
                            {Object.entries(stats?.languages || {}).length === 0 ? (
                                <p className="text-gray-500">No language data available.</p>
                            ) : (
                                Object.entries(stats?.languages || {}).map(([lang, count]: any) => (
                                    <div key={lang} className="flex items-center justify-between">
                                        <span className="text-gray-700 font-medium">{lang}</span>
                                        <div className="flex items-center gap-4 flex-1 mx-4">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-orange-600 h-2.5 rounded-full"
                                                    style={{ width: `${Math.min(100, (count / (stats?.library?.total_items || 1)) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <span className="text-gray-900 font-bold">{count}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions / Placeholders for future Analytics */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Ad Performance (Placeholder)</h2>
                        <p className="text-gray-600 mb-4">
                            Access comprehensive ad reports directly in your <a href="https://adsense.google.com" target="_blank" className="text-blue-600 hover:underline">Google AdSense Dashboard</a>.
                        </p>
                        <div className="p-4 bg-gray-50 rounded border border-gray-200 text-sm text-gray-600">
                            Internal impression tracking coming soon. For now, download counts act as a proxy for user engagement.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
