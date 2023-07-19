import React, { Dispatch, ReactNode, SetStateAction } from 'react';

interface IProps {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function Drawer({ children, isOpen, setIsOpen }: IProps) {
  return (
    <main
      className={
        'fixed z-10 bg-gray-900 backdrop-blur-sm bg-opacity-25 inset-0 transform ease-in-out max-h-[100vh] overflow-auto' +
        (isOpen
          ? ' transition-opacity opacity-100 duration-500 translate-x-0  max-h-[100vh] overflow-auto'
          : ' transition-all delay-500 opacity-0 translate-x-full  ')
      }>
      <section
        className={
          ' w-screen max-w-4xl right-0 absolute bg-base-300 h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  ' +
          (isOpen ? ' translate-x-0 max-h-[100vh] overflow-auto' : ' translate-x-full ')
        }>
        <article className="relative w-screen h-full max-h-[100vh] overflow-auto max-w-4xl p-8">{children}</article>
      </section>
      <section
        className="w-screen h-full cursor-pointer "
        onClick={() => {
          setIsOpen(false);
        }}></section>
    </main>
  );
}
