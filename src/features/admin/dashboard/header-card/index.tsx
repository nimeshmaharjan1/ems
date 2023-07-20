import { LucideIcon } from 'lucide-react';
import React from 'react';

const HeaderCard: React.FC<{
  Icon: LucideIcon;
  title: string;
  data: any;
}> = ({ Icon, title, data }) => {
  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <Icon size={42} className="text-success"></Icon>
        <p className="font-semibold text-lg">{title}</p>
        <p className="font-bold text-xl">
          {title === 'Revenue' && <span>रू </span>}
          {data}
        </p>
      </div>
    </div>
  );
};

export default HeaderCard;
