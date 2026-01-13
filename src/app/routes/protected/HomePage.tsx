import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Download, Play } from 'lucide-react';
import { Button } from '@/components/ui';
import { SidebarAd } from '@/components/ads/AdBanner';
import { useLibrary } from '@/hooks/useLibrary';
import LibraryCard from '@/components/library/LibraryCard';
import { SkeletonCard } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { DatabaseService } from '@/services/database.service';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!user?.id) {
        setIsAdmin(false);
        return;
      }
      try {
        const status = await DatabaseService.isUserAdmin(user.id);
        setIsAdmin(status);
      } catch {
        setIsAdmin(false);
      }
    };
    run();
  }, [user?.id]);

  // Get trending memes
  const { 
    data: trendingItems, 
    loading: trendingLoading 
  } = useLibrary({ sort_by: 'trending' }, 1, 8);

  // Get latest memes
  const { 
    data: latestItems, 
    loading: latestLoading 
  } = useLibrary({ sort_by: 'latest' }, 1, 8);

  const quickStats = [
    {
      icon: Download,
      label: 'Downloads Today',
      value: '2,847',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      icon: Play,
      label: 'Plays Today',
      value: '18,293',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      icon: TrendingUp,
      label: 'Trending Now',
      value: '156',
      change: '+24%',
      changeType: 'positive' as const,
    },
    {
      icon: Clock,
      label: 'New This Week',
      value: '89',
      change: '+5%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to ilovememe.in</h1>
          <p className="mt-2 text-gray-600">
            Discover trending memes and find the perfect content for your creations
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {stat.label}
                  </p>
                  <div className="flex items-center mt-1">
                    <p className="text-lg font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <span className={`ml-2 text-xs font-medium ${
                      stat.changeType === 'positive' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Trending Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
                  <p className="text-gray-600">Most popular memes this week</p>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/library?sort=trending">
                    View All
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                ) : (
                  trendingItems.slice(0, 4).map((item) => (
                    <LibraryCard key={item.id} item={item} isAdmin={isAdmin} />
                  ))
                )}
              </div>
            </section>

            {/* Latest Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Latest Additions</h2>
                  <p className="text-gray-600">Fresh memes added recently</p>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/library?sort=latest">
                    View All
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                ) : (
                  latestItems.slice(0, 4).map((item) => (
                    <LibraryCard key={item.id} item={item} isAdmin={isAdmin} />
                  ))
                )}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="/library?emotion=funny">
                    😂 Browse Funny Memes
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="/library?media_type=audio">
                    🎵 Audio Only
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="/library?media_type=video">
                    🎥 Video Only
                  </Link>
                </Button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="mt-8 lg:mt-0 lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Sidebar Ad */}
              <SidebarAd />

              {/* Popular Emotions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Popular This Week
                </h3>
                <div className="space-y-3">
                  {[
                    { emotion: 'funny', emoji: '😂', trend: 'up' },
                    { emotion: 'dramatic', emoji: '🎭', trend: 'up' },
                    { emotion: 'thug', emoji: '😎', trend: 'same' },
                    { emotion: 'surprised', emoji: '😱', trend: 'up' },
                    { emotion: 'sarcastic', emoji: '🙄', trend: 'down' },
                  ].map((item) => (
                    <Link
                      key={item.emotion}
                      to={`/library?emotion=${item.emotion}`}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{item.emoji}</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {item.emotion}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {item.trend === 'up' && (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        )}
                        {item.trend === 'down' && (
                          <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                        )}
                        {item.trend === 'same' && (
                          <div className="h-4 w-4 bg-gray-300 rounded-full" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-primary-50 rounded-lg border border-primary-200 p-6">
                <h3 className="text-lg font-semibold text-primary-900 mb-3">
                  💡 Pro Tip
                </h3>
                <p className="text-sm text-primary-800">
                  Use specific keywords in your search to find exactly what you need. 
                  Try searching for dialogue or sound effects!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;