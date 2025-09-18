import React from "react";

const VideoPlayer = ({ className = "" }) => (
  <div className={`flex h-full w-full flex-col ${className}`.trim()}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70 md:text-base">
        Video Profil
      </h3>
      <span className="rounded-full bg-white/10 px-2 py-1 text-[0.65rem] font-semibold tracking-wide text-white/70 md:px-3">
        Looping 24/7
      </span>
    </div>
    <div className="relative mt-3 flex flex-1 overflow-hidden rounded-2xl bg-black/70 shadow-inner ring-1 ring-white/15">
      <video
        src="/videos/Video.mp4"
        controls
        autoPlay
        loop
        muted
        className="h-full w-full object-cover"
      />
    </div>
  </div>
);

export default VideoPlayer;
