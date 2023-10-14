import { BaggageClaim, Bug, Cog, Hotel, LayoutDashboard, LayoutGrid, Package, Repeat2, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import SidebarItem from './sidebar-item';
import { DASHBOARD_LINKS } from '@/features/admin/enums';

export default function Sidebar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}: {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [isActive, setIsActive] = useState<string>(router.pathname);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    setIsActive(router.pathname);
  }, [router.pathname]);

  if (!isMounted) return null;
  return (
    <aside className="admin-sidebar fixed flex flex-col w-[12rem] min-h-screen px-6 pt-3 pb-8 border-r border-r-base-300 max-h-[100vh] overflow-auto">
      {/* <Link passHref href="/products"> */}
      {/*   <Image src="/logo.png" alt="logo" width={120} height={120}></Image> */}
      {/* </Link> */}
      <nav className="-mx-3 space-y-6">
        <div className="space-y-3 ">
          <label className="px-3 text-xs text-gray-500 uppercase">analytics</label>
          <SidebarItem
            isActive={router.pathname === DASHBOARD_LINKS.dashboard}
            href={DASHBOARD_LINKS.dashboard}
            Icon={LayoutGrid}
            title="Dashboard"></SidebarItem>
        </div>

        <div className="space-y-3 ">
          <label className="px-3 text-xs text-gray-500 uppercase">modules</label>

          <SidebarItem
            isActive={router.pathname === DASHBOARD_LINKS.products}
            href={DASHBOARD_LINKS.products}
            Icon={Package}
            title="Products"></SidebarItem>

          <SidebarItem
            isActive={router.pathname === DASHBOARD_LINKS.category}
            href={DASHBOARD_LINKS.category}
            Icon={Repeat2}
            title="Category"></SidebarItem>

          <SidebarItem
            isActive={router.pathname === DASHBOARD_LINKS.company}
            href={DASHBOARD_LINKS.company}
            Icon={Hotel}
            title="Company"></SidebarItem>

          <SidebarItem
            isActive={router.pathname === DASHBOARD_LINKS.orders}
            href={DASHBOARD_LINKS.orders}
            Icon={BaggageClaim}
            title="Orders"></SidebarItem>
          <SidebarItem
            isActive={router.pathname === DASHBOARD_LINKS.complaints}
            href={DASHBOARD_LINKS.complaints}
            Icon={Bug}
            title="Complaints"></SidebarItem>
          <SidebarItem
            isActive={router.pathname === DASHBOARD_LINKS.users}
            href={DASHBOARD_LINKS.users}
            Icon={Users}
            title="Users"></SidebarItem>
        </div>

        <div className="space-y-3 ">
          <label className="px-3 text-xs text-gray-500 uppercase">Customization</label>

          <SidebarItem
            isActive={router.pathname === DASHBOARD_LINKS.settings}
            href={DASHBOARD_LINKS.settings}
            Icon={Cog}
            title="Setting"></SidebarItem>
        </div>
      </nav>
    </aside>
  );
}
