import React, { useEffect, useState } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { ArtistService, type Artist } from '@/services/artist.service';
import { useToast } from '@/hooks/useToast';

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
      setLangs('English');
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Artists</h1>
            <p className="text-sm text-gray-600">Manage artists for upload selection.</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Input
              placeholder="Search artists"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <Select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              options={[{ value: '', label: 'All languages' }, ...allLanguages.map(l => ({ value: l, label: l }))]}
              className="w-40"
            />
            <Button onClick={load} loading={loading}>Search</Button>
            <Button onClick={() => startEdit()} variant="outline">New</Button>
          </div>
        </div>

        {/* Edit/Create drawer */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Artist' : 'Add Artist'}</h3>
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Languages (multi-select)</p>
            <div className="flex flex-wrap gap-2">
              {allLanguages.map((lang) => {
                const active = langs.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setLangs((prev) =>
                        prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
                      );
                    }}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm border transition-colors',
                      active
                        ? 'bg-orange-100 text-orange-700 border-orange-200'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    )}
                    aria-pressed={active}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} loading={saving}>{editing ? 'Update' : 'Create'}</Button>
            {editing && (
              <Button variant="outline" onClick={() => startEdit(null)}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-3 sm:grid-cols-4 text-sm font-semibold text-gray-600 px-4 py-2 border-b">
            <span>Name</span>
            <span>Languages</span>
            <span className="hidden sm:block">Created</span>
            <span className="text-right">Actions</span>
          </div>
          {artists.map((a) => (
            <div key={a.id} className="grid grid-cols-3 sm:grid-cols-4 items-center px-4 py-3 border-b text-sm text-gray-800">
              <span className="truncate">{a.name}</span>
              <span className="truncate">{(a.languages || []).join(', ') || '—'}</span>
              <span className="hidden sm:block">{a.created_at ? new Date(a.created_at).toLocaleDateString() : ''}</span>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => startEdit(a)}>Edit</Button>
                <Button size="sm" variant="ghost" className="text-red-600" onClick={() => remove(a.id)}>Delete</Button>
              </div>
            </div>
          ))}
          {!artists.length && (
            <div className="px-4 py-6 text-sm text-gray-500 text-center">No artists yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistsPage;
