import React from 'react';
import Modal from '@/components/ui/Modal';
import {
    TermsContent,
    PrivacyContent,
    RefundContent,
    ShippingContent,
    ContactContent
} from '@/components/policies';

export type PolicyType = 'terms' | 'privacy' | 'refunds' | 'shipping' | 'contact' | null;

interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: PolicyType;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, type }) => {
    const getContent = () => {
        switch (type) {
            case 'terms':
                return { title: 'Terms and Conditions', component: <TermsContent /> };
            case 'privacy':
                return { title: 'Privacy Policy', component: <PrivacyContent /> };
            case 'refunds':
                return { title: 'Cancellations and Refunds', component: <RefundContent /> };
            case 'shipping':
                return { title: 'Shipping and Delivery Policy', component: <ShippingContent /> };
            case 'contact':
                return { title: 'Contact Us', component: <ContactContent /> };
            default:
                return { title: '', component: null };
        }
    };

    const { title, component } = getContent();

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title={title}
            className="max-w-4xl max-h-[85vh] overflow-y-auto"
        >
            <div className="mt-2">
                {component}
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-100 px-4 py-2 text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default PolicyModal;
