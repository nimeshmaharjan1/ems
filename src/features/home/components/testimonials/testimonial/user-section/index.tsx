import Image from 'next/image';
import React from 'react';

const UserSection = () => {
  return (
    <section className="user-section flex gap-x-4 items-center mt-3">
      <div className="avatar">
        <div className="w-14 bg-base-300 shadow-lg rounded-full">
          <Image height={200} width={200} alt="user" src="/icons/default-user.png" />
        </div>
      </div>
      <section className="user-details">
        <h2 className="text-sm font-bold mb-1">John Doe</h2>
        <p className="text-sm">Position, Company Name</p>
      </section>
    </section>
  );
};

export default UserSection;
