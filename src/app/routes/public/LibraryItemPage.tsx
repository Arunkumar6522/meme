import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, LoadingSpinner } from '@/components/ui';
import LibraryCard from '@/components/library/LibraryCard';
import { LibraryService } from '@/services/library.service';
import type { LibraryItem } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import GoogleAdSense from '@/components/ads/GoogleAdSense';
import { DatabaseService } from '@/services/database.service';

const LibraryItemPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [item, setItem] = useState<LibraryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Check admin status
    useEffect(() => {
        const checkAdmin = async () => {
            if (user?.id) {
                try {
                    const status = await DatabaseService.isUserAdmin(user.id);
                    setIsAdmin(status);
                } catch {
                    setIsAdmin(false);
                }
            }
        };
        checkAdmin();
    }, [user?.id]);

    // Load Item
    useEffect(() => {
        const loadItem = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await LibraryService.getLibraryItem(id);
                if (!data) {
                    setError('Item not found');
                } else {
                    setItem(data);
                    // Update page title/meta for SEO
                    document.title = `${data.title} - I Love Meme`;
                }
            } catch (err) {
                setError('Failed to load item');
            } finally {
                setLoading(false);
            }
        };
        loadItem();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">404 - Not Found</h1>
                <p className="text-gray-600 mb-6">{error || 'This meme does not exist or has been removed.'}</p>
                <Button asChild>
                    <Link to="/library">Browse Library</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:underline">
                        <Link to="/library" className="flex items-center gap-2 text-gray-600">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Library
                        </Link>
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-0">
                        <LibraryCard
                            item={item}
                            isAdmin={isAdmin}
                            locked={false}
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <GoogleAdSense type="square" className="w-full max-w-md" />
                </div>
            </div>
        </div>
    );
};

export default LibraryItemPage;
