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

        {/* Coming Soon Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mb-4">
              <Wand2 className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Meme Generator</h3>
            <p className="text-gray-600 mb-4">
              Generate custom memes using AI with your own text and style preferences.
            </p>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mb-4">
              <Upload className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload & Edit</h3>
            <p className="text-gray-600 mb-4">
              Upload your own content and use our editing tools to create viral memes.
            </p>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mb-4">
              <Sparkles className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Templates</h3>
            <p className="text-gray-600 mb-4">
              Choose from hundreds of trending templates and customize them instantly.
            </p>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-6">
              <Wand2 className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Creation Tools Coming Soon
            </h2>
            <p className="text-gray-600 mb-8">
              We're working hard to bring you the most advanced meme creation tools. 
              In the meantime, explore our extensive library of ready-to-use memes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <a href="/library">Browse Library</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:support@memelibrary.com">Request Features</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-primary-50 rounded-lg border border-primary-200 p-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-primary-900 mb-2">
              Be the first to know
            </h3>
            <p className="text-primary-800 mb-6">
              Get notified when our creation tools launch and receive exclusive early access.
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <Button>
                Notify Me
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;