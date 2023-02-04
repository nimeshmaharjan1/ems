import React, { FC, ReactNode } from 'react';

const ViewOneLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export default ViewOneLayout;
