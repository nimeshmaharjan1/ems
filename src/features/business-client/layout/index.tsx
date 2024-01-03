import { Public_Sans } from '@next/font/google';
import { USER_ROLES } from '@prisma/client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BusinessClientLayoutHeader from './header';
import BusinessLgAside from './lg-aside';
const inter = Public_Sans({ subsets: ['latin'] });
const customId = 'custom-id-yes';
const BusinessClientDashboardLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      signIn();
    } else {
      if (session.data) {
        if (session.data?.user?.role === USER_ROLES.BUSINESS_CLIENT) {
          setIsLoading(false);
        } else {
          toast.warning('Unauthorized', {
            toastId: customId,
            autoClose: 2000,
          });
          // showToast(Toast.warning, "Unauthorized");
          router.replace('/');
        }
      }
    }
  }, [router, session.data, session.status]);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center gap-x-3">
        <span className="loading loading-spinner loading-lg"></span>
        Loading...
      </div>
    );
  return (
    <div className={`block lg:flex min-h-screen ${inter.className}`}>
      <BusinessLgAside></BusinessLgAside>
      <section className="flex-1">
        <BusinessClientLayoutHeader></BusinessClientLayoutHeader>
        <main className="px-6 py-6">{children}</main>
      </section>
    </div>
  );
};

export default BusinessClientDashboardLayout;
