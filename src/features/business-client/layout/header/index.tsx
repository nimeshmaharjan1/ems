import NavAvatarDropdown from '@/features/user/avatar-dropdown';
import UserProfileModal from '@/features/user/profile-modal';
import ThemeToggler from '@/shared/components/theme-toggler';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import { useRef } from 'react';
import BusinessClientSmDrawer from '../sm-drawer';

const BusinessClientLayoutHeader = () => {
  const profileModalRef = useRef<HTMLDialogElement>(null);
  const { theme } = useTheme();
  return (
    <header
      className={classNames('flex items-center justify-between p-4 md:px-6 border-b', {
        'border-b-slate-800': theme === 'dark',
      })}>
      <div className="flex lg:hidden items-center gap-x-1">
        <BusinessClientSmDrawer></BusinessClientSmDrawer>
        <h2 className="font-bold text-lg">Orders</h2>
      </div>
      <h2 className="hidden lg:block font-bold text-2xl">Orders</h2>

      <div className="flex items-center gap-x-3">
        <NavAvatarDropdown profileModalRef={profileModalRef} />
        <ThemeToggler></ThemeToggler>
      </div>
      <UserProfileModal ref={profileModalRef} isFromNoPhoneNumber={false}></UserProfileModal>
    </header>
  );
};

export default BusinessClientLayoutHeader;
