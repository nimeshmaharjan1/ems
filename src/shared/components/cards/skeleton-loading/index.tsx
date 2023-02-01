import React from 'react';

const SkeletonLoadingCard = () => {
  return (
    <div className="card w-72 sm:w-[20rem] bg-base-100 shadow-xl border-2">
      <figure className="bg-gray-400 mb-4 h-52 border-b-2 rounded-full animate-pulse"></figure>
      <div className="h-5 bg-gray-400 rounded mb-3 mx-4 w-60 animate-pulse"></div>
      <div className="h-5 bg-gray-400 rounded mb-3 mx-4 w-40 animate-pulse"></div>
      <div className="h-5 bg-gray-400 rounded mb-3 mx-4 w-24 animate-pulse"></div>
    </div>
  );
};

export default SkeletonLoadingCard;
