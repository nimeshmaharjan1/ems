import Rating from '@/shared/components/rating';
import Image from 'next/image';
import React from 'react';

const UserReview = () => {
  return (
    <section className="user-review border-b-2 pb-8 pt-6 first:pt-0 last:border-b-0">
      <div className="user-detail flex gap-4">
        {/* <Image width={100} height={100} alt="review-user" src="/icons/default-user.png" /> */}
        <div className="avatar w-[2.8rem]">
          <Image
            className="rounded-full shadow-lg"
            fill
            alt="review-user"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          />
        </div>
        <div className="details">
          <p className="font-bold mb-1">Nimesh Maharjan</p>
          <div className="rating-section">
            <Rating></Rating>
          </div>
        </div>
      </div>
      <section className="user-comment-section mt-4">
        <p className="text-sm xl:text-base opacity-80  leading-relaxed">
          This is the bag of my dreams. I took it on my last vacation and was able to fit an absurd amount of snacks for the many long and
          hungry flights. This is the bag of my dreams. I took it on my last vacation and was able to fit an absurd amount of snacks for the
          many long and hungry flights.This is the bag of my dreams. I took it on my last vacation and was able to fit an absurd amount of
          snacks for the many long and hungry flights.This is the bag of my dreams. I took it on my last vacation and was able to fit an
          absurd amount of snacks for the many long and hungry flights.
        </p>
      </section>
    </section>
  );
};

export default UserReview;
