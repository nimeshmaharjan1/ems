import React, { ReactNode } from 'react';

const FormControl: React.FC<{ children: ReactNode; label: string; errorMessage?: string }> = ({ children, label, errorMessage }) => {
  return (
    <div className="form-control w-full gap-1">
      <label className="label">{label}</label>
      {children}
      <label className="label text-sm font-[400] opacity-80 text-error">{errorMessage}</label>
    </div>
  );
};

export default FormControl;
