import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { Sparkles, Clock } from 'lucide-react';

const CreatePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-6">
          <Sparkles className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Feature Coming Soon
        </h1>
        <p className="text-gray-600 mb-6">
          The Create Meme feature is currently under development. We're working hard to bring you an amazing meme creation experience!
        </p>
        <div className="flex items-center justify-center text-sm text-gray-500 mb-8">
          <Clock className="h-4 w-4 mr-2" />
          <span>Stay tuned for updates</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/library">Browse Library</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;