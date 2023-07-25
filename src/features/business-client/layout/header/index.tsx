import NavAvatarDropdown from '@/features/user/avatar-dropdown';
import { useRef } from 'react';
import BusinessClientSmDrawer from '../sm-drawer';
import UserProfileModal from '@/features/user/profile-modal';
import ThemeToggler from '@/shared/components/theme-toggler';

const BusinessClientLayoutHeader = () => {
  const profileModalRef = useRef<HTMLDialogElement>(null);

  return (
    <header className="h-14 flex items-center justify-between px-4 shadow">
      <BusinessClientSmDrawer></BusinessClientSmDrawer>
      <div className="flex items-center gap-x-3">
        <ThemeToggler></ThemeToggler>
        <NavAvatarDropdown profileModalRef={profileModalRef} />
      </div>
      <UserProfileModal ref={profileModalRef} isFromNoPhoneNumber={false}></UserProfileModal>
    </header>
  );
};

export default BusinessClientLayoutHeader;
