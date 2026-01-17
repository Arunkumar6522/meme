import React, { useEffect, useState } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { ArtistService, type Artist } from '@/services/artist.service';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';

const ArtistsPage: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Artist | null>(null);
  const [name, setName] = useState('');
  const allLanguages = ['English', 'Tamil', 'Malayalam', 'Kannada', 'Hindi', 'Telugu'];
  const [langs, setLangs] = useState<string[]>(['English']);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await ArtistService.list(search.trim() || undefined);
      const filtered = filterLang
        ? data.filter((a) => (a.languages || []).includes(filterLang))
        : data;
      setArtists(filtered);
    } catch (e: any) {
      showError(e.message || 'Failed to load artists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEdit = (artist?: Artist) => {
    setEditing(artist || null);
    setName(artist?.name || '');
    setLangs(artist?.languages || ['English']);
  };

  const save = async () => {
    if (!name.trim()) {
      showError('Name is required', 'Validation');
      return;
    }
    setSaving(true);
    const languages = langs.length ? langs : ['English'];
    try {
      if (editing) {
        await ArtistService.update(editing.id, { name: name.trim(), languages });
        showSuccess('Artist updated', 'Artists');
      } else {
        await ArtistService.create(name.trim(), languages);
        showSuccess('Artist created', 'Artists');
      }
      setEditing(null);
      setName('');
      setLangs(['English']);
      load();
    } catch (e: any) {
      showError(e.message || 'Save failed', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this artist?')) return;
    try {
      await ArtistService.remove(id);
      showSuccess('Artist deleted', 'Artists');
      load();
    } catch (e: any) {
      showError(e.message || 'Delete failed', 'Error');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:text-4xl sm:tracking-tight">
                Manage Artists
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Organize and categorize content creators and sources.
              </p>
            </div>
            <div className="mt-4 flex md:ml-4 md:mt-0">
              <Button onClick={() => startEdit()} size="lg" className="shadow-sm">
                <span className="mr-2 text-xl">+</span> New Artist
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow max-w-lg">
              <Input
                placeholder="Search artists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 h-12 text-lg"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              options={[{ value: '', label: 'All Languages' }, ...allLanguages.map(l => ({ value: l, label: l }))]}
              className="w-full sm:w-48 h-12"
            />
            <Button
              onClick={load}
              loading={loading}
              variant="secondary"
              size="lg"
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Edit Drawer */}
        {(editing || name) && (
          <div className="mb-10 bg-gray-50 rounded-xl border border-gray-200 p-6 md:p-8 animate-fade-in">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editing ? 'Edit Artist Details' : 'Add New Artist'}
              </h3>
              <button onClick={() => { setEditing(null); setName(''); }} className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Input
                  label="Artist Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vadivelu"
                  className="text-lg"
                />
              </div>
              <div className="space-y-4">
                <span className="block text-sm font-medium text-gray-700">Languages</span>
                <div className="flex flex-wrap gap-2">
                  {allLanguages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLangs(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang])}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        langs.includes(lang)
                          ? 'bg-primary-600 text-white shadow-md transform scale-105'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button variant="ghost" onClick={() => { setEditing(null); setName(''); }}>Cancel</Button>
              <Button onClick={save} loading={saving} size="lg" className="min-w-[120px]">
                {editing ? 'Save Changes' : 'Create Artist'}
              </Button>
            </div>
          </div>
        )}

        {/* Grid Layout for Artists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xl">
                  {artist.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(artist)} className="p-2 text-gray-400 hover:text-primary-600 rounded-full hover:bg-primary-50 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => remove(artist.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                {artist.name}
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {(artist.languages || []).map(lang => (
                  <span key={lang} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {lang}
                  </span>
                ))}
                {(!artist.languages || artist.languages.length === 0) && (
                  <span className="text-xs text-gray-400 italic">No languages</span>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                <span>Added {new Date(artist.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {!loading && artists.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto h-24 w-24 text-gray-200 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No artists found</h3>
            <p className="mt-1 text-gray-500">Get started by creating a new artist.</p>
            <div className="mt-6">
              <Button onClick={() => startEdit()}>Create Artist</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistsPage;
