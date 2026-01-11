import React from 'react';
import { cn } from '@/utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, className }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-lg p-6',
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
