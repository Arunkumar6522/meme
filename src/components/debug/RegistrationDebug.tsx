import React from 'react';

interface RegistrationDebugProps {
  step: 'form' | 'otp';
  otpContext: any;
  formData: any;
  errors: any;
}

const RegistrationDebug: React.FC<RegistrationDebugProps> = ({ step, otpContext, formData, errors }) => {
  // Only show in development
  if (import.meta.env.MODE !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🐛 Registration Debug</h3>
      <div className="space-y-1">
        <div><strong>Step:</strong> {step}</div>
        <div><strong>Has OTP Context:</strong> {otpContext ? '✅' : '❌'}</div>
        {otpContext && (
          <div><strong>OTP Email:</strong> {otpContext.email}</div>
        )}
        <div><strong>Form Email:</strong> {formData.email}</div>
        <div><strong>Errors:</strong> {Object.keys(errors).length > 0 ? JSON.stringify(errors, null, 2) : 'None'}</div>
      </div>
    </div>
  );
};

export default RegistrationDebug;