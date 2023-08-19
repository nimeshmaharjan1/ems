import NavAvatarDropdown from "@/features/user/avatar-dropdown";
import { useRef } from "react";
import BusinessClientSmDrawer from "../sm-drawer";
import UserProfileModal from "@/features/user/profile-modal";
import ThemeToggler from "@/shared/components/theme-toggler";
import { useTheme } from "next-themes";
import classNames from "classnames";

const BusinessClientLayoutHeader = () => {
  const profileModalRef = useRef<HTMLDialogElement>(null);
  const { theme } = useTheme();
  return (
    <header
      className={classNames(
        "flex items-center justify-between p-4 px-6 border-b",
        {
          "border-b-slate-800": theme === "dark",
        }
      )}
    >
      <h2 className="font-bold text-2xl">Orders</h2>
      <BusinessClientSmDrawer></BusinessClientSmDrawer>
      <div className="flex items-center gap-x-3">
        <NavAvatarDropdown profileModalRef={profileModalRef} />
        <ThemeToggler></ThemeToggler>
      </div>
      <UserProfileModal
        ref={profileModalRef}
        isFromNoPhoneNumber={false}
      ></UserProfileModal>
    </header>
  );
};

export default BusinessClientLayoutHeader;
