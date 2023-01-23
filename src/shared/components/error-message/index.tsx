import React, { ReactNode } from 'react';

const ErrorMessage: React.FC<{ children: ReactNode | string }> = ({ children }) => {
  return (
    <div className="mt-2">
      <span className="text-red-400 text-sm">{children}</span>
    </div>
  );
};

export default ErrorMessage;
