import React from 'react';
import { ShippingContent } from '@/components/policies';

const ShippingPage: React.FC = () => {
    return (
        <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
            <div className="relative max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Shipping and Delivery Policy
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-gray-500">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
                <ShippingContent />
            </div>
        </div>
    );
};

export default ShippingPage;
