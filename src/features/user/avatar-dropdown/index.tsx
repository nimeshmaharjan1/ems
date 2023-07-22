import { USER_ROLES } from '@prisma/client';
import { User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';
import { GiSettingsKnobs } from 'react-icons/gi';
import { RxDashboard } from 'react-icons/rx';

const NavAvatarDropdown: React.FC<{
  profileModalRef: React.RefObject<HTMLDialogElement>;
}> = ({ profileModalRef }) => {
  const { data: session } = useSession();
  return (
    <div className="dropdown dropdown-end ">
      <label tabIndex={0} className="btn btn-sm btn-ghost btn-circle avatar">
        {session?.user?.image ? (
          <div className="avatar online">
            <div className="w-8 h-8 rounded-full shadow">
              <Image src={session?.user?.image} height={500} width={500} alt="user" />
            </div>
          </div>
        ) : (
          <>
            <User />
            {/* <Image src="/icons/default-user.png" height={500} width={500} alt="user" /> */}
            {/* <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                            <span className="text-xs">{session?.user?.username.charAt(0).toUpperCase()}</span>
                          </div> */}
          </>
        )}
      </label>
      <ul tabIndex={0} className="z-50 p-2 flex flex-col dropdown-content mt-3 shadow-md bg-base-100 rounded-box w-52">
        {(session?.user?.role === USER_ROLES.STAFF || session?.user?.role === USER_ROLES.SUPER_ADMIN) && (
          <li>
            <Link
              className="flex items-center p-2 rounded-lg gap-2 hover:bg-base-200 transition-all hover:text-primary cursor-pointer"
              href="/admin/dashboard">
              <RxDashboard></RxDashboard>
              Dashboard
            </Link>
          </li>
        )}
        <li>
          <a
            className="flex items-center p-2 rounded-lg gap-2 hover:bg-base-200 transition-all hover:text-primary cursor-pointer"
            onClick={() => profileModalRef.current?.show()}>
            <AiOutlineUser></AiOutlineUser>
            Profile
          </a>
        </li>
        {/* <li>
          <a className="flex items-center p-2 rounded-lg gap-2 hover:bg-base-200 transition-all hover:text-primary cursor-pointer">
            <GiSettingsKnobs></GiSettingsKnobs>Settings
          </a>
        </li> */}
        <li onClick={() => signOut({ callbackUrl: '/products' })}>
          <a className="flex items-center p-2 rounded-lg gap-2 hover:bg-base-200 transition-all hover:text-primary cursor-pointer">
            <AiOutlineLogout></AiOutlineLogout>Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default NavAvatarDropdown;
