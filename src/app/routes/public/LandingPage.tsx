import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Lock } from 'lucide-react';
import { Button, Input, SkeletonCard } from '@/components/ui';
// Removed old AdBanner import - using SimpleAds only
import { MonetagLeaderboard, MonetagRectangle } from '@/components/ads/MonetagBannerAd';
import { useLibrary } from '@/hooks/useLibrary';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import LibraryCard from '@/components/library/LibraryCard';
import { DatabaseService } from '@/services/database.service';

const LanguageSection: React.FC<{
  lang: string;
  canPlayAll: boolean;
  isAdmin: boolean;
  onSeeAll: () => void;
}> = ({ lang, canPlayAll, isAdmin, onSeeAll }) => {
  const audioQuery = useLibrary({ media_type: 'audio', sort_by: 'trending', languages: [lang] }, 1, 10);
  const videoQuery = useLibrary({ media_type: 'video', sort_by: 'trending', languages: [lang] }, 1, 10);

  const renderRail = (items: any[], loading: boolean, kind: 'audio' | 'video') => {
    if (loading) {
      return (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex-none w-40">
              <SkeletonCard />
            </div>
          ))}
        </div>
      );
    }

    if (!items?.length) {
      return <div className="text-sm text-gray-600">No {kind}s yet.</div>;
    }

    return (
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {items.map((item: any, idx: number) => (
          <div key={item.id} className="flex-none w-40 sm:w-44">
            <LibraryCard item={item} locked={!canPlayAll && idx >= 5} isAdmin={isAdmin} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Trending in {lang}</h2>
          {!canPlayAll && (
            <p className="text-sm text-gray-600">
              Showing 5 previews. <span className="font-medium">Login to unlock all 10.</span>
            </p>
          )}
        </div>
        <Button
          className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
          onClick={onSeeAll}
        >
          See all
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          Audio {!canPlayAll && <Lock className="h-4 w-4 text-orange-600" />}
        </div>
        {renderRail(audioQuery.data, audioQuery.loading, 'audio')}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          Video {!canPlayAll && <Lock className="h-4 w-4 text-orange-600" />}
        </div>
        {renderRail(videoQuery.data, videoQuery.loading, 'video')}
      </div>
    </section>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSelectedLanguages } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin for showing admin-only actions on cards (delete/edit)
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

  const languagesToShow = useMemo(
    () => ['Tamil', 'English', 'Malayalam', 'Kannada', 'Telugu'],
    []
  );

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const value = searchTerm.trim();
    if (!value) return;
    navigate(`/library?search=${encodeURIComponent(value)}`);
  };

  return (
    <div className="bg-white">
      {/* Monetag Header Banner Ad */}
      <div className="mt-4 mb-6">
        <MonetagLeaderboard className="max-w-4xl mx-auto" />
      </div>

      {/* Side Ads (desktop only) */}
      <div className="hidden lg:block">
        <div className="fixed left-4 top-24 z-20">
          <MonetagRectangle className="w-40" />
        </div>
        <div className="fixed right-4 top-24 z-20">
          <MonetagRectangle className="w-40" />
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              I Love Meme - Your Ultimate Meme Audio Destination
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-700 max-w-2xl">
              Welcome to I Love Meme (ilovememe.in)! Discover trending meme audios, funny sound effects, and viral video clips. Search, preview, and download the best meme sounds for your content creation needs.
            </p>
            <form
              onSubmit={handleSearch}
              className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-3xl"
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

      {/* Monetag Content Rectangle Ad */}
      <div className="my-8">
        <MonetagRectangle className="max-w-md mx-auto" />
      </div>

      {/* Preview rail */}
      <div className="bg-orange-50/60 border-t border-b border-orange-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
          {languagesToShow.map((lang) => (
            <LanguageSection
              key={lang}
              lang={lang}
              canPlayAll={!!user}
              isAdmin={isAdmin}
              onSeeAll={() => {
                if (!user) {
                  navigate('/auth/login');
                  return;
                }
                setSelectedLanguages([lang]);
                navigate('/library');
              }}
            />
          ))}
        </div>
      </div>

      {/* Monetag Footer Banner Ad */}
      <div className="mb-8">
        <MonetagLeaderboard className="max-w-4xl mx-auto" />
      </div>
    </div>
  );
};

export default LandingPage;