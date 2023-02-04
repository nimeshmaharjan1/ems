import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const Breadcrumbs: React.FC<{ slug: string }> = ({ slug }) => {
  const { pathname } = useRouter();
  const paths = pathname.split('/');
  return (
    <div className="text-sm breadcrumbs mb-6">
      <ul>
        {paths.map((path, index) => {
          return (
            <li key={path}>
              {index === paths.length - 1 ? (
                <span>{slug}</span>
              ) : (
                <Link href={`/${paths.slice(0, index + 1).join('/')}`}>{path.charAt(0).toUpperCase() + path.slice(1)}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
