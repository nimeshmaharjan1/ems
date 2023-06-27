import { DASHBOARD_LINKS } from '@/features/admin/enums';
import { default as classNames, default as classnames } from 'classnames';
import { PackageCheck } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { FiBox, FiSettings } from 'react-icons/fi';
import { GoLocation } from 'react-icons/go';
import { HiOutlineUsers } from 'react-icons/hi2';

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

  if (!isMounted) return null;
  return (
    <aside className="fixed flex flex-col w-64 min-h-screen px-5 pb-8 pt-3 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l ">
      <Link passHref href="/products">
        <Image src="/logo.png" alt="logo" width={150} height={150}></Image>
      </Link>
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="-mx-3 space-y-6 ">
          <div className="space-y-3 ">
            <label className="px-3 text-xs text-gray-500 uppercase">analytics</label>

            <a
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg  hover:bg-gray-100  hover:text-gray-700"
              href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">Dashboard</span>
            </a>

            <a
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg  hover:bg-gray-100  hover:text-gray-700"
              href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">Preformance</span>
            </a>
          </div>

          <div className="space-y-3 ">
            <label className="px-3 text-xs text-gray-500 uppercase">content</label>

            <a
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg  hover:bg-gray-100  hover:text-gray-700"
              href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">Guides</span>
            </a>

            <a
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg  hover:bg-gray-100  hover:text-gray-700"
              href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">Hotspots</span>
            </a>

            <a
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg  hover:bg-gray-100  hover:text-gray-700"
              href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">Checklists</span>
            </a>
          </div>

          <div className="space-y-3 ">
            <label className="px-3 text-xs text-gray-500 uppercase">Customization</label>

            <a
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg  hover:bg-gray-100  hover:text-gray-700"
              href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">Themes</span>
            </a>

            <a
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg  hover:bg-gray-100  hover:text-gray-700"
              href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>

              <span className="mx-2 text-sm font-medium">Setting</span>
            </a>
          </div>
        </nav>
      </div>
    </aside>
  );
}

// return (
//   <aside
//     className={classnames(
//       `sticky z-50 left-0 top-0 bottom-0 right-0 h-screen bg-base-100 shadow-lg duration-500 flex justify-between flex-col items-start px-2`,
//       {
//         ['w-[15.5rem]']: !isSidebarCollapsed,
//         ['w-[4.2rem]']: isSidebarCollapsed,
//       }
//     )}>
//     <div className="upper">
//       <div
//         onClick={() => {
//           router.push('/products');
//         }}
//         className={classnames('logo cursor-pointer mt-4 relative gap-2 px-2', {
//           'w-28 h-16  ml-4': !isSidebarCollapsed,
//           'w-8 ml-2 h-6': isSidebarCollapsed,
//         })}>
//         <Image src="/logo.png" alt="logo" fill></Image>
//         {/* <GoLocation className={classnames('text-primary text-2xl duration-1000')}></GoLocation>
//         <h1
//           className={classnames('text-primary font-bold text-xl', {
//             hidden: isSidebarCollapsed,
//           })}>
//           EMS
//         </h1> */}
//       </div>
//       {/* <div
//         className={classnames('search-section flex items-center gap-2 rounded-md mt-6 bg-base-200 py-2 duration-1000', {
//           'pl-3 mr-3': !isSidebarCollapsed,
//           'justify-center w-10 px-2 ml-1': isSidebarCollapsed,
//         })}
//         onClick={() => setIsSidebarCollapsed(false)}>
//         <BsSearch
//           className={classnames('block float-left cursor-text  mb-[0.15rem] duration-1000', {
//             'mr-1': !isSidebarCollapsed,
//           })}></BsSearch>
//         <input
//           type="search"
//           placeholder="Search"
//           className={classnames('outline-none duration-1000 text-base-content bg-transparent w-[180px]  focus:outline-none', {
//             hidden: isSidebarCollapsed,
//           })}
//         />
//       </div> */}
//       <ul
//         className={classNames('pt-3 w-full pl-1 pr-6', {
//           ['w-[15.5rem]']: !isSidebarCollapsed,
//         })}>
//         {/* <li
//           className={classnames(
//             'text-base-content duration-300 flex items-center gap-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
//             {
//               ['w-10']: isSidebarCollapsed,
//               ['p-3']: !isSidebarCollapsed,
//               'active-nav-link': isActive === DASHBOARD_LINKS.dashboard,
//             }
//           )}
//           onClick={() => {
//             setIsActive(DASHBOARD_LINKS.dashboard);
//             router.push(DASHBOARD_LINKS.dashboard);
//           }}>
//           <span className="block float-left text-2xl">
//             <RxDashboard></RxDashboard>
//           </span>
//           <span className={`font-normal text-sm  flex-1 ${isSidebarCollapsed && 'hidden'}`}>Dashboard</span>
//         </li> */}
//         <li
//           className={classnames(
//             'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
//             {
//               ['w-10']: isSidebarCollapsed,
//               ['p-3']: !isSidebarCollapsed,
//               'active-nav-link': isActive === DASHBOARD_LINKS.products,
//             }
//           )}
//           onClick={() => {
//             setIsActive(DASHBOARD_LINKS.products);
//             router.push(DASHBOARD_LINKS.products);
//           }}>
//           <span className="block float-left text-2xl">
//             <FiBox></FiBox>
//           </span>
//           <span className={`font-normal text-sm flex-1 ${isSidebarCollapsed && 'hidden'}`}>Products</span>
//         </li>
//         <li
//           className={classnames(
//             'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
//             {
//               ['w-10']: isSidebarCollapsed,
//               ['p-3']: !isSidebarCollapsed,
//               'active-nav-link': isActive === DASHBOARD_LINKS.users,
//             }
//           )}
//           onClick={() => {
//             setIsActive(DASHBOARD_LINKS.users);
//             router.push(DASHBOARD_LINKS.users);
//           }}>
//           <span className="block float-left text-2xl">
//             <HiOutlineUsers></HiOutlineUsers>
//           </span>
//           <span className={`font-normal text-sm flex-1 ${isSidebarCollapsed && 'hidden'}`}>Users</span>
//         </li>
//         {/* <li
//           className={classnames(
//             'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
//             {
//               ['w-10']: isSidebarCollapsed,
//               ['p-3']: !isSidebarCollapsed,
//               'active-nav-link': isActive === DASHBOARD_LINKS.myProfile,
//             }
//           )}
//           onClick={() => {
//             setIsActive(DASHBOARD_LINKS.myProfile);
//             router.push(DASHBOARD_LINKS.myProfile);
//           }}>
//           <span className="block float-left text-2xl">
//             <ImProfile></ImProfile>
//           </span>
//           <span className={`font-normal text-sm flex-1 ${isSidebarCollapsed && 'hidden'}`}>My Profile</span>
//         </li> */}
//         <li
//           className={classnames(
//             'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
//             {
//               ['w-10']: isSidebarCollapsed,
//               ['p-3']: !isSidebarCollapsed,
//               'active-nav-link': isActive === DASHBOARD_LINKS.orders,
//             }
//           )}
//           onClick={() => {
//             setIsActive(DASHBOARD_LINKS.orders);
//             router.push(DASHBOARD_LINKS.orders);
//           }}>
//           <span className="block float-left text-2xl">
//             <PackageCheck />
//           </span>
//           <span className={`font-normal text-sm flex-1 ${isSidebarCollapsed && 'hidden'}`}>Orders</span>
//         </li>
//         <li
//           className={classnames(
//             'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
//             {
//               ['w-10']: isSidebarCollapsed,
//               ['p-3']: !isSidebarCollapsed,
//               'active-nav-link': isActive === DASHBOARD_LINKS.settings,
//             }
//           )}
//           onClick={() => {
//             setIsActive(DASHBOARD_LINKS.settings);
//             router.push(DASHBOARD_LINKS.settings);
//           }}>
//           <span className="block float-left text-2xl">
//             <FiSettings></FiSettings>
//           </span>
//           <span className={`font-normal text-sm flex-1 ${isSidebarCollapsed && 'hidden'}`}>Settings</span>
//         </li>
//       </ul>
//     </div>
//     <div
//       className={classNames('actions mb-6 flex items-center', {
//         ['w-[15.5rem]']: isSidebarCollapsed,
//       })}>
//       <div
//         onClick={() => {
//           signOut({ callbackUrl: '/products' });
//         }}
//         className={classnames(
//           'ml-2 text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md ',
//           {
//             ['w-10']: isSidebarCollapsed,
//             ['p-3']: !isSidebarCollapsed,
//           }
//         )}>
//         <span className="block float-left text-2xl">
//           <AiOutlineLogout></AiOutlineLogout>
//         </span>
//         <span className={`font-normal text-sm flex-1 ${isSidebarCollapsed && 'hidden'}`}>Logout</span>
//       </div>
//     </div>
//   </aside>
// );
