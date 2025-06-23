import React from "react";
import HeaderTitle from "./components/HeaderTitle";
import LaporanPanel from "./components/LaporanPanel";
import VideoPlayer from "./components/VideoPlayer";
import RunningText from "./components/RunningText";
import "./index.css";

function App() {
  return (
    <div className="app-container">
      <HeaderTitle />
      <div className="content">
        <div className="laporan">
          <LaporanPanel />
        </div>
        <div className="video">
          <VideoPlayer />
        </div>
      </div>
      <RunningText />
    </div>
  );
}

export default App;
