import React from 'react';

const Skeleton = () => {
  return (
    <div className="animate-pulse bg-gray-200/10 rounded-xl py-8 px-6 flex flex-col justify-centner gap-2">
      <div className="bg-gray-200/50 rounded-lg p-4 w-[10rem]"></div>
      <div className="bg-gray-200/50 rounded-lg p-2 w-[24rem] mb-5"></div>
      <div className="bg-gray-200/50 rounded-lg p-5 w-[24rem] mb-5"></div>
      <div className="bg-gray-200/50 rounded-lg w-[24rem] h-1 mb-10 items-center justify-center"></div>

      <div className="bg-gray-200/50 rounded-lg p-2 w-[8rem]"></div>
      <div className="bg-gray-200/50 rounded-lg p-5 w-[24rem] mb-5"></div>

      <div className="bg-gray-200/50 rounded-lg p-2 w-[8rem]"></div>
      <div className="bg-gray-200/50 rounded-lg p-5 w-[24rem] mb-5"></div>

      <div className="bg-gray-200/50 rounded-lg p-2 w-[8rem]"></div>
      <div className="bg-gray-200/50 rounded-lg p-5 w-[24rem] mb-5"></div>

      <div className="bg-gray-200/50 rounded-lg p-5 w-[24rem] mb-5"></div>

      <div className="bg-gray-200/50 rounded-lg p-2 w-[14rem]"></div>
    </div>
  );
};

export default Skeleton;
