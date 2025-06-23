const VideoPlayer = () => (
  <div className="video-container">
    <video
      src="/video-demo.mp4"
      controls
      autoPlay
      loop
      className="video-element"
    />
  </div>
);
export default VideoPlayer;
