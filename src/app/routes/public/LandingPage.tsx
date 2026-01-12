import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Download, Search, Lock } from 'lucide-react';
import { Button, SkeletonCard, Input } from '@/components/ui';
import { BannerAd, SidebarAd } from '@/components/ads/AdBanner';
import { useLibrary } from '@/hooks/useLibrary';
import { useAuth } from '@/hooks/useAuth';
import LibraryCard from '@/components/library/LibraryCard';
import { useLanguage } from '@/hooks/useLanguage';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedLanguages } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch top 6 audio + 6 video for public preview
  const { data: topAudios, loading: topAudiosLoading } = useLibrary({ media_type: 'audio', sort_by: 'trending', languages: selectedLanguages }, 1, 6);
  const { data: topVideos, loading: topVideosLoading } = useLibrary({ media_type: 'video', sort_by: 'trending', languages: selectedLanguages }, 1, 6);

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
        <div className="fixed left-4 top-24 z-20">
          <SidebarAd className="w-40" />
        </div>
        <div className="fixed right-4 top-24 z-20">
          <SidebarAd className="w-40" />
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ilovememe.in — clips and audios, ready to drop in.
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
              Search, preview, and download trending meme audios and short-ready videos. Sign in to unlock everything.
            </p>
            <form
              onSubmit={handleSearch}
              className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-3xl mx-auto"
            >
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audio/video by keyword, emotion, or character"
                className="w-full h-12 sm:h-14 text-base sm:text-lg"
              />
              <Button
                type="submit"
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white border-orange-600 h-12 sm:h-14 text-base sm:text-lg"
                disabled={!searchTerm.trim()}
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Preview rail */}
      <div className="bg-orange-50/60 border-t border-b border-orange-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
          {/* Audio rail */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Top Audios</h2>
                <p className="text-sm text-gray-600">Preview and download trending meme sounds.</p>
              </div>
              <div className="flex gap-3">
                {!user && (
                  <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50" onClick={() => navigate('/auth/login')}>
                    <Lock className="h-4 w-4 mr-2" />
                    Unlock All
                  </Button>
                )}
                <Button
                  className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                  onClick={() => user ? navigate('/library?media_type=audio') : navigate('/auth/login')}
                >
                  {user ? 'See all' : 'Login to see all'}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {topAudiosLoading &&
                Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)}
              {!topAudiosLoading && topAudios && topAudios.map((item) => (
                <LibraryCard key={item.id} item={item} />
              ))}
              {!topAudiosLoading && (!topAudios || topAudios.length === 0) && (
                <div className="col-span-full text-sm text-gray-600">No audios yet.</div>
              )}
            </div>
          </section>

          {/* Video rail */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Top Videos</h2>
                <p className="text-sm text-gray-600">Short-ready clips and green-screen templates.</p>
              </div>
              <div className="flex gap-3">
                {!user && (
                  <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50" onClick={() => navigate('/auth/login')}>
                    <Lock className="h-4 w-4 mr-2" />
                    Unlock All
                  </Button>
                )}
                <Button
                  className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                  onClick={() => user ? navigate('/library?media_type=video') : navigate('/auth/login')}
                >
                  {user ? 'See all' : 'Login to see all'}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topVideosLoading &&
                Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)}
              {!topVideosLoading && topVideos && topVideos.map((item) => (
                <LibraryCard key={item.id} item={item} />
              ))}
              {!topVideosLoading && (!topVideos || topVideos.length === 0) && (
                <div className="col-span-full text-sm text-gray-600">No videos yet.</div>
              )}
            </div>
          </section>

          {!user && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-orange-200 bg-white p-4 sm:p-5">
              <div className="flex items-center gap-3 text-gray-800">
                <Lock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-semibold">Login to unlock the full library</p>
                  <p className="text-sm text-gray-600">
                    Access all audio/video, filters, and downloads.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50" onClick={() => navigate('/auth/login')}>Sign In</Button>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600" onClick={() => navigate('/auth/register')}>Create Account</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;