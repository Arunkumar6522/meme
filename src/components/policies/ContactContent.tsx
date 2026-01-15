import React from 'react';

export const ContactContent: React.FC = () => (
    <div className="prose prose-sm sm:prose max-w-none text-gray-500">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center">
                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
                    <p className="mt-2 text-base text-gray-500">
                        You may contact us using the information below:
                    </p>
                    <div className="mt-4 text-left">
                        <p><strong>Merchant Legal entity name:</strong> ARUNKUMAR</p>
                        <p><strong>Registered Address:</strong> 622 Manglam Electronic Market Jaipur Rajasthan India 302001</p>
                        <p><strong>Operational Address:</strong> 622 Manglam Electronic Market Jaipur Rajasthan India 302001</p>
                        <p><strong>Telephone No:</strong> 9610086208</p>
                        <p><strong>E-Mail ID:</strong> info@ilovememe.in</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
