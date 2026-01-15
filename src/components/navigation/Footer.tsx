import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <p className="text-sm font-semibold text-gray-900">ilovememe.in</p>
            <p className="text-sm text-gray-600 mt-2">Trending meme audios & short-ready videos.</p>
            <div className="mt-4 text-xs text-gray-500">
              © {new Date().getFullYear()} ilovememe.in. All rights reserved.
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <a
              href="/terms-and-conditions"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Terms & Conditions
            </a>
            <a
              href="/privacy-policy"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Privacy Policy
            </a>
            <a
              href="/cancellation-refund-policy"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Cancellation & Refund
            </a>
            <a
              href="/shipping-policy"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Shipping Policy
            </a>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Support</h3>
            <a
              href="/contact-us"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Contact Us
            </a>
            <a
              href="mailto:info@ilovememe.in"
              className="text-sm text-orange-700 hover:text-orange-800"
            >
              info@ilovememe.in
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

