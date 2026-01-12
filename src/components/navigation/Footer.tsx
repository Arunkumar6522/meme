import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">ilovememe.in</p>
            <p className="text-sm text-gray-600">Trending meme audios & short-ready videos.</p>
          </div>
          <div className="text-sm text-gray-700">
            <p className="font-medium text-gray-900">Contact</p>
            <a
              href="mailto:info@ilovememe.in"
              className="text-orange-700 hover:text-orange-800 underline underline-offset-2"
            >
              info@ilovememe.in
            </a>
          </div>
        </div>
        <div className="mt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} ilovememe.in. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

