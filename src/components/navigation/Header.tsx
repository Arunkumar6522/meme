import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Shield, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { DatabaseService } from '@/services/database.service';
import { cn } from '@/utils/cn';

// Cache admin status to avoid repeated API calls
const adminStatusCache = new Map<string, { status: boolean; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const LANG_STORAGE_KEY = 'preferred_languages';
const ALL_LANGUAGES = ['English', 'Tamil', 'Malayalam', 'Kannada', 'Hindi', 'Telugu'];

// Export function to clear admin cache (used on logout)
export const clearAdminCache = () => {
  adminStatusCache.clear();
};

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLangs, setSelectedLangs] = useState<string[]>(() => {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      } catch {}
    }
    return ['English', 'Tamil'];
  });
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

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, JSON.stringify(selectedLangs));
    if (user?.id) {
      supabase
        .from('users')
        .update({ preferred_languages: selectedLangs })
        .eq('id', user.id)
        .then(() => {
          // ignore
        })
        .catch(() => {
          // ignore
        });
    }
  }, [selectedLangs]);

  const navigation = useMemo(() => {
    const base = [{ name: 'Home', href: '/' }];
    if (isAdmin) {
      base.push({ name: 'Library', href: '/library' });
      base.push({ name: 'Upload', href: '/upload' });
      base.push({ name: 'Create (beta)', href: '/create' });
    }
    return base;
  }, [isAdmin]);

  const userNavigation = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Wishlist', href: '/favorites', icon: Heart },
  ];

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
                  <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
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
            {/* Language selector (desktop) */}
            <div className="relative">
              <button
                onClick={() => setLangOpen((prev) => !prev)}
                className="text-sm px-3 py-2 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Languages
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg p-3 space-y-2 z-20">
                  {ALL_LANGUAGES.map((lang) => (
                    <label key={lang} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedLangs.includes(lang)}
                        onChange={() => {
                          setSelectedLangs((prev) =>
                            prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
                          );
                        }}
                      />
                      {lang}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* User Menu / Auth Buttons */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Mobile menu button (only icon; remove inline avatar) */}
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

                {/* Desktop user actions */}
                {user ? (
                  <>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate('/upload')}
                        className="hidden sm:flex items-center gap-2"
                        aria-label="Admin Upload"
                      >
                        <Shield className="h-4 w-4" />
                        <span className="hidden md:inline">Admin</span>
                      </Button>
                    )}
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
              
              {/* Languages mobile */}
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Languages</p>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_LANGUAGES.map((lang) => (
                    <label key={lang} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedLangs.includes(lang)}
                        onChange={() => {
                          setSelectedLangs((prev) =>
                            prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
                          );
                        }}
                      />
                      {lang}
                    </label>
                  ))}
                </div>
              </div>
              
              {user && isAdmin && (
                <Link
                  to="/admin/upload"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shield className="h-5 w-5 mr-3" aria-hidden="true" />
                  Admin Upload
                </Link>
              )}
              
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