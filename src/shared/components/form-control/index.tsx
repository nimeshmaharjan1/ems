import React, { ReactNode } from 'react';

const FormControl: React.FC<{ children: ReactNode; label?: string; errorMessage?: string } & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  label,
  errorMessage,
  ...rest
}) => {
  return (
    <div className="form-control w-full gap-1" {...rest}>
      {label && <label className="label">{label}</label>}
      {children}
      {errorMessage && <label className="label text-sm font-[400] opacity-80 text-error">{errorMessage}</label>}
    </div>
  );
};

export default FormControl;
