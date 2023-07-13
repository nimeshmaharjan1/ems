import ThemeToggler from '@/shared/components/theme-toggler';
import { User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

const getRoute = (route: string): string => {
  return route.slice(7);
};

const Header: React.FC = () => {
  const router = useRouter();
  const session = useSession();
  return (
    <header className="z-50 flex items-center justify-end w-full h-[4.5rem] px-8 border-b border-b-base-300 bg-base-100 gap-x-3">
      {/* <h3 className="text-2xl font-semibold capitalize">{router.pathname.split('/')}</h3> */}
      <section className="flex items-center gap-4">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle avatar">
            {session.data?.user?.image ? (
              <Image
                width={60}
                height={60}
                className="mt-1 rounded-full"
                src={session.data.user.image}
                alt={session?.data?.user?.name || 'user'}></Image>
            ) : (
              <User></User>
            )}
          </label>
          <ul tabIndex={0} className="mt-1 z-[1] p-2 shadow-lg bg-base-200 menu space-y-1 dropdown-content rounded-box w-52">
            <li>
              <a className="flex items-center gap-2 p-2 transition-all rounded-lg cursor-pointer hover:bg-base-200 hover:text-primary">
                Profile
              </a>
            </li>
            <li onClick={() => signOut()}>
              <a className="flex items-center gap-2 p-2 transition-all rounded-lg cursor-pointer hover:bg-base-200 hover:text-primary">
                Sign Out
              </a>
            </li>
          </ul>
        </div>
        <ThemeToggler></ThemeToggler>
      </section>
    </header>
  );
};

export default Header;
