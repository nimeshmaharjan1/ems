import classNames from 'classnames';
import { ShoppingCart } from 'lucide-react';
import { useTheme } from 'next-themes';

const BusinessLgAside = () => {
  const { theme } = useTheme();
  return (
    <aside
      className={classNames('w-56 hidden lg:block border-r p-4 pt-5', {
        'border-r-slate-800': theme === 'dark',
      })}>
      <h1 className="font-bold text-2xl text-primary pl-4">EME</h1>
      <div className="flex-col flex gap-y-2 mt-10">
        <button className="btn btn-primary btn-block btn-sm !text-base !h-10 !gap-x-2 !justify-start">
          <ShoppingCart className="w-4 h-4"></ShoppingCart>
          <span className="text-sm"> My Orders</span>
        </button>
        {/* <button className="btn btn-ghost btn-block !justify-start">
          Hello
        </button> */}
      </div>
    </aside>
  );
};

export default BusinessLgAside;
