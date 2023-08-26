import UserProfileModal from "@/features/user/profile-modal";
import ThemeToggler from "@/shared/components/theme-toggler";
import { User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef } from "react";

const getRoute = (route: string): string => {
  return route.slice(7);
};

const Header: React.FC = () => {
  const router = useRouter();
  const session = useSession();
  const profileModalRef = useRef<HTMLDialogElement>(null);
  return (
    <header className="z-50 flex items-center justify-between w-full h-[4.5rem] px-8 border-b border-b-base-300 bg-base-100 gap-x-3">
      <Link href="/" passHref>
        {" "}
        <h3 className="text-2xl font-semibold text-primary capitalize">EME</h3>
      </Link>
      <section className="flex items-center gap-6">
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-sm btn-circle avatar"
          >
            {session.data?.user?.image ? (
              <Image
                width={64}
                height={64}
                className="rounded-full"
                src={session.data.user.image}
                alt={session?.data?.user?.name || "user"}
              ></Image>
            ) : (
              <User className="w-5 h-5"></User>
            )}
          </label>
          <ul
            tabIndex={0}
            className="mt-1 z-[1] p-2 shadow-lg bg-base-200 menu space-y-1 dropdown-content rounded-box w-52"
          >
            <li>
              <a
                onClick={() => profileModalRef.current?.show()}
                className="flex items-center gap-2 p-2 transition-all rounded-lg cursor-pointer hover:bg-base-200 hover:text-primary"
              >
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
        <UserProfileModal
          ref={profileModalRef}
          isFromNoPhoneNumber={false}
        ></UserProfileModal>
        <ThemeToggler></ThemeToggler>
      </section>
    </header>
  );
};

export default Header;
