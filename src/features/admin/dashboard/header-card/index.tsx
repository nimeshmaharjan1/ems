import { LucideIcon } from 'lucide-react';
import React from 'react';

const HeaderCard: React.FC<{
  Icon: LucideIcon;
  title: string;
  data: any;
  isLoading: boolean;
}> = ({ Icon, title, data, isLoading }) => {
  return (
    <div className="card bg-base-200">
      <div className="card-body">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[115px]">
            <span className="loading loading-spinner"></span>
          </div>
        ) : (
          <>
            <Icon size={42} className="text-primary"></Icon>
            <p className="font-semibold text-lg">{title}</p>
            <p className="font-bold text-xl">{data}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderCard;
