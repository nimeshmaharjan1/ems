import React, { ReactNode } from 'react';
import ShopByAside from '../main/shop-by';

const ViewAllLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-6 gap-8 relative gap-x-12">
      <div className="col-span-6 md:col-span-2">
        <ShopByAside></ShopByAside>
      </div>
      <div className="col-span-6 md:col-span-4">{children}</div>
    </div>
  );
};

export default ViewAllLayout;
