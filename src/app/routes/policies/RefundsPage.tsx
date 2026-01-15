import React from 'react';
import { RefundContent } from '@/components/policies';

const RefundsPage: React.FC = () => {
    return (
        <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
            <div className="relative max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Cancellations and Refunds
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-gray-500">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
                <RefundContent />
            </div>
        </div>
    );
};

export default RefundsPage;
