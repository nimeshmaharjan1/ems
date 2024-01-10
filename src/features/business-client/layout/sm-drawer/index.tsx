import Drawer from '@/shared/components/drawer';
import { Home, Menu, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const BusinessClientSmDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <button className="btn-ghost btn btn-sm flex lg:hidden" onClick={() => setIsDrawerOpen(true)}>
        <Menu size={18}></Menu>
      </button>
      <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen}>
        <header className="h-14 flex items-center justify-between border-b border-b-base-100">
          <Link passHref href="/">
            <h2 className="text-primary font-bold text-xl">EME</h2>
          </Link>
          <button className="btn-ghost btn-sm btn" onClick={() => setIsDrawerOpen(false)}>
            <X size={18}></X>
          </button>
        </header>
        <main className="mt-4 space-y-3">
          <button className="btn btn-primary btn-block btn-sm !text-base !h-10 !gap-x-2 !justify-start">
            <ShoppingCart className="w-4 h-4"></ShoppingCart>
            <span className="text-sm">My Orders</span>
          </button>
          <button onClick={() => router.push('/products')} className="btn btn-block btn-sm !text-base !h-10 !gap-x-2 !justify-start">
            <Home className="w-4 h-4"></Home>
            <span className="text-sm">Home</span>
          </button>
        </main>
      </Drawer>
    </>
  );
};

export default BusinessClientSmDrawer;
