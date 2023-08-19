import classNames from "classnames";
import { ShoppingCart } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

const BusinessLgAside = () => {
  const { theme } = useTheme();
  return (
    <aside
      className={classNames("w-56 hidden lg:block border-r p-4 pt-5", {
        "border-r-slate-800": theme === "dark",
      })}
    >
      <h1 className="font-bold text-2xl text-primary pl-4">EME</h1>
      <div className="flex-col flex gap-y-2 mt-10">
        <button className="btn btn-primary btn-block !text-base !gap-x-3 !justify-start">
          <ShoppingCart className="mb-[0.2rem]"></ShoppingCart>
          My Orders
        </button>
        {/* <button className="btn btn-ghost btn-block !justify-start">
          Hello
        </button> */}
      </div>
    </aside>
  );
};

export default BusinessLgAside;
