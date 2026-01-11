import React, { useState } from 'react';
import UploadForm from '@/features/admin/UploadForm';
import { Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

const UploadOnlyPage: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center space-y-4">
          <p className="text-lg font-semibold text-gray-900">Upload successful</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setShowSuccess(false)}>Upload another</Button>
            <Button variant="outline" onClick={() => navigate('/library')}>
              Go to Library
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Meme</h1>
            <p className="text-sm text-gray-600">Add audio or video with title, keywords, artist, thumbnail, and language.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/library')}>
            Back to Library
          </Button>
        </div>
        <UploadForm onSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
};

export default UploadOnlyPage;
