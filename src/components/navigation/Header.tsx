import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Heart, User, Languages, Zap } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { DatabaseService } from '@/services/database.service';
import { cn } from '@/utils/cn';
import { ALL_LANGUAGES, useLanguage } from '@/hooks/useLanguage';
import logo from '@/app/logo.png';

// Cache admin status to avoid repeated API calls
const adminStatusCache = new Map<string, { status: boolean; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Export function to clear admin cache (used on logout)
export const clearAdminCache = () => {
  adminStatusCache.clear();
};

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { selectedLanguages, setSelectedLanguages } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin (with caching)
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.id) {
        setIsAdmin(false);
        return;
      }

      // Check cache first
      const cached = adminStatusCache.get(user.id);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setIsAdmin(cached.status);
        return;
      }

      try {
        const adminStatus = await DatabaseService.isUserAdmin(user.id);
        setIsAdmin(adminStatus);
        // Update cache
        adminStatusCache.set(user.id, { status: adminStatus, timestamp: Date.now() });
      } catch (error) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user?.id]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // language persistence handled by LanguageProvider

  const navigation = useMemo(() => {
    const base = [
      { name: 'Home', href: '/' },
      { name: 'Library', href: '/library' },
    ];
    // Admin-only links
    // Admin-only links
    if (isAdmin) {
      base.push({ name: 'Upload', href: '/upload' });
      base.push({ name: 'Artists', href: '/admin/artists' });
      base.push({ name: 'Dashboard', href: '/admin/dashboard' });
      base.push({ name: 'Create (beta)', href: '/create' });
    }
    return base;
  }, [isAdmin, user]);

  const userNavigation = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Wishlist', href: '/favorites', icon: Heart },
    { name: 'Upgrade to Pro', href: '/pro', icon: Zap },
  ];

  const selectedLabel = useMemo(() => {
    if (!selectedLanguages.length) return 'English';
    if (selectedLanguages.length === 1) return selectedLanguages[0];
    return `${selectedLanguages[0]} +${selectedLanguages.length - 1}`;
  }, [selectedLanguages]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
            >
              <img src={logo} alt="ilovememe.in" className="h-8 w-8 rounded object-contain" />
              <span className="text-xl font-bold text-gray-900">ilovememe.in</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language selector (always visible, incl. mobile) */}
            <div className="relative">
              <button
                onClick={() => setLangOpen((prev) => !prev)}
                className={cn(
                  'inline-flex items-center gap-2 text-sm px-3 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50',
                  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
                )}
                aria-label="Select languages"
                aria-expanded={langOpen}
              >
                <Languages className="h-4 w-4 text-orange-600" />
                <span className="hidden sm:inline">Language:</span>
                <span className="font-medium">{selectedLabel}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-3 space-y-2 z-50">
                  <div className="text-xs font-semibold text-gray-600">Filter by language</div>
                  <div className="grid grid-cols-2 gap-2">
                    {ALL_LANGUAGES.map((lang) => (
                      <label
                        key={lang}
                        className={cn(
                          'flex items-center gap-2 text-sm rounded-md px-2 py-1 border',
                          selectedLanguages.includes(lang)
                            ? 'border-orange-200 bg-orange-50 text-gray-900'
                            : 'border-gray-200 bg-white text-gray-700'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(lang)}
                          onChange={() => {
                            setSelectedLanguages(
                              selectedLanguages.includes(lang)
                                ? selectedLanguages.filter((l) => l !== lang)
                                : [...selectedLanguages, lang]
                            );
                          }}
                        />
                        {lang}
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      className="text-xs text-gray-600 hover:text-gray-900"
                      onClick={() => setSelectedLanguages(['English'])}
                    >
                      Reset
                    </button>
                    <button
                      className="text-xs text-orange-700 hover:text-orange-900 font-semibold"
                      onClick={() => setLangOpen(false)}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button (only icon; remove inline avatar) */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Desktop user actions */}
            {user ? (
              <>
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 p-1"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                  >
                    <User className="h-5 w-5 text-orange-600" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <item.icon className="h-4 w-4 mr-3" aria-hidden="true" />
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-3" aria-hidden="true" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/auth/login')}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/auth/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white shadow-lg relative z-40">
            <nav className="space-y-1" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Language selector moved to top bar for mobile; keep menu clean */}

              {/* Admin upload link is already included in navigation for admins */}

              {user && (
                <>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      <LogOut className="h-5 w-5 mr-3" aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isUserMenuOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsMobileMenuOpen(false);
          }}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Header;