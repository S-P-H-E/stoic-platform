import React from 'react';
import Comments from './Comments';

export default function SkeletonLesson() {
  return (
    <div className="flex flex-col w-full">
          <div className="h-[35px] w-[400px] bg-border rounded-lg mb-2 animate-pulse" />
          <div className="flex flex-col lg:flex-row relative "> {/* responsiveness here */}
          <div className="bg-border rounded-3xl shadow-2xl animate-pulse w-full lg:w-[80%] h-full aspect-video" />

          <div className="lg:hidden my-5 lg:mb-20 rounded-2xl p-5 animate-pulse">
            <div className="h-[25px] w-[150px] bg-border rounded-lg mb-2" />
            <div className="h-[20px] lg:w-[400px] bg-border rounded-lg"></div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col justify-center items-center gap-y-5 relative">
              <div className="lg:ml-8 rounded-2xl bg-border h-[80px] w-full lg:w-[200px] 2xl:w-[300px] animate-pulse" />
              <div className="lg:ml-8 rounded-2xl bg-gradient-to-b from-border w-full lg:w-[200px] 2xl:w-[300px] to-transparent h-[80px] animate-pulse" />
            </div>
          </div>
        </div>
      <div className="hidden lg:flex flex-col my-5 lg:mb-20 rounded-2xl p-5 animate-pulse">
        <div className="h-[25px] w-[150px] bg-border rounded-lg mb-2" />
        <div className="h-[20px] lg:w-[400px] bg-border rounded-lg"></div>
      </div>
      <div className="hidden lg:block">
        <Comments courseId={''} lessonId={''} />
      </div>
    </div>
  );
}
