import Drawer from '@/shared/components/drawer';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const BusinessClientSmDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      </Drawer>
    </>
  );
};

export default BusinessClientSmDrawer;
