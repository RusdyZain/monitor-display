import React from "react";

const VideoPlayer = () => (
  <div className="w-full h-full flex items-center justify-center bg-black">
    <video
      src="/videos/Video.mp4"
      controls
      autoPlay
      loop
      muted
      className="w-full max-h-[90%] rounded-xl shadow-lg"
    />
  </div>
);

export default VideoPlayer;
