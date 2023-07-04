import classNames from 'classnames';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode } from 'react';

const SidebarItem: React.FC<{ href: string; Icon: LucideIcon; title: string; isActive: boolean }> = ({ href, Icon, title, isActive }) => {
  return (
    <Link
      className={classNames('flex items-center px-3 py-2 transition-all duration-300 transform rounded-lg group hover:bg-primary', {
        'bg-primary': isActive,
      })}
      href={href}>
      <Icon
        strokeWidth={1.5}
        size={20}
        className={classNames('group-hover:text-primary-content', {
          'text-primary-content': isActive,
        })}
      />

      <span
        className={classNames('mx-2 text-sm font-medium group-hover:text-primary-content', {
          'text-primary-content': isActive,
        })}>
        {title}
      </span>
    </Link>
  );
};

export default SidebarItem;
