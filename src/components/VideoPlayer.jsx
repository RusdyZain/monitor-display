import React from "react";

const VideoPlayer = () => (
  <div className="flex items-center justify-center bg-black shadow-lg overflow-hidden rounded-xl border-8 border-[#352c29] my-2 mx-2">
    <video
      src="/videos/Video.mp4"
      controls
      autoPlay
      loop
      muted
      className="w-full h-full object-contain"
    />
  </div>
);

export default VideoPlayer;
