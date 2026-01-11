import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Download, Search, Zap, Lock, Film } from 'lucide-react';
import { Button, SkeletonCard, Input } from '@/components/ui';
import { BannerAd } from '@/components/ads/AdBanner';
import { useLibrary } from '@/hooks/useLibrary';
import { useAuth } from '@/hooks/useAuth';
import LibraryCard from '@/components/library/LibraryCard';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch top 10 audio memes for public preview
  const {
    data: topAudios,
    loading: topAudiosLoading,
  } = useLibrary({ media_type: 'audio', sort_by: 'trending' }, 1, 10);
  const features = [
    {
      icon: Search,
      title: 'Find it fast',
      description: 'Search by keyword, emotion, or character to get the exact clip you need.',
    },
    {
      icon: Download,
      title: 'Ready to drop in',
      description: 'One-click downloads in the right formats for shorts and reels.',
    },
    {
      icon: Play,
      title: 'Preview first',
      description: 'Listen/watch before saving so you never pick the wrong clip.',
    },
    {
      icon: Zap,
      title: 'Tamil-first & growing',
      description: 'Built for Tamil creators now, expanding to Telugu/Kannada/Malayalam/Hindi later.',
    },
  ];

  const stats = [
  ];

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const value = searchTerm.trim();
    if (!value) return;
    navigate(`/library?search=${encodeURIComponent(value)}`);
  };

  return (
    <div className="bg-white">
      {/* Side Ads (desktop only) */}
      <div className="hidden lg:block">
        <div className="fixed left-4 top-32 z-20">
          <BannerAd className="w-48" />
        </div>
        <div className="fixed right-4 top-32 z-20">
          <BannerAd className="w-48" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-6xl">
              Clips & Audio for Tamil Creators
              <span className="text-primary-600 block sm:inline"> Ready to Drop In</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              Stop hunting. Get the exact meme audio, green-screen templates, and short-ready video clips with proper keywords. Built for shorts/reels editors, PR teams, and digital marketers.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4 sm:px-0">
              <Button size="lg" className="w-full sm:w-auto min-w-[200px]" asChild>
                <Link to="/library">
                  Browse Library
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]" asChild>
                <Link to="/auth/register">
                  Get Started Free
                </Link>
              </Button>
            </div>
            <form
              onSubmit={handleSearch}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto px-4 sm:px-0"
            >
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by keyword, emotion, or character (e.g., rage, funny, hero)"
                className="w-full"
              />
              <Button type="submit" className="w-full sm:w-auto" disabled={!searchTerm.trim()}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-200 to-primary-400 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Top Audios Preview (public) */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top 10 Audio Memes</h2>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Preview what’s trending. Sign in to unlock everything (audio & video).
              </p>
            </div>
            <div className="flex gap-3">
              {!user && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/auth/login')}
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Unlock Full Library
                </Button>
              )}
              <Button onClick={() => navigate('/library')}>Go to Library</Button>
            </div>
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center"
            aria-label="Top audio memes"
          >
            {topAudiosLoading &&
              Array.from({ length: 10 }).map((_, idx) => <SkeletonCard key={idx} />)}

            {!topAudiosLoading && topAudios && topAudios.length > 0 && topAudios.map((item) => (
              <LibraryCard key={item.id} item={item} />
            ))}

            {!topAudiosLoading && (!topAudios || topAudios.length === 0) && (
              <div className="col-span-full text-center text-gray-600">
                No audio memes available yet. Check back soon!
              </div>
            )}
          </div>

          {!user && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex items-center gap-3 text-gray-700">
                <Lock className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-semibold">Want more? Unlock the full library</p>
                  <p className="text-sm text-gray-600">
                    Sign in to browse all audio and video memes, downloads, and filters.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate('/auth/login')}>Sign In</Button>
                <Button onClick={() => navigate('/auth/register')}>Create Account</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      {/* Features Section */}
      <div className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Built to solve the Tamil creator clip hunt
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
              No more searching YouTube for scraps. Get curated, searchable audio/video templates with the right tags.
            </p>
          </div>
          <div className="mx-auto mt-12 sm:mt-16 lg:mt-24 max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col mobile-card p-6 sm:p-4 lg:p-0 lg:shadow-none lg:border-none lg:bg-transparent">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon className="h-6 w-6 sm:h-5 sm:w-5 flex-none text-primary-600" aria-hidden="true" />
                    {feature.title}
                  </dt>
                  <dd className="mt-3 sm:mt-4 flex flex-auto flex-col text-sm sm:text-base leading-6 sm:leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Ready to create viral content?
            </h2>
            <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 px-4 sm:px-0">
              Join thousands of content creators who use Meme Library to make their content stand out.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4 sm:px-0">
              <Button size="lg" className="w-full sm:w-auto min-w-[200px]" asChild>
                <Link to="/auth/register">
                  Start Creating Now
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]" asChild>
                <Link to="/library">
                  Explore Library
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;