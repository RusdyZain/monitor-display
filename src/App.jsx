import HeaderTitle from "./components/HeaderTitle";
import LaporanPanel from "./components/LaporanPanel";
import VideoPlayer from "./components/VideoPlayer";
import RunningText from "./components/RunningText";
import "./index.css";

function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans">
      <HeaderTitle />
      <div className="flex flex-1 flex-row">
        <div className="w-[40%]">
          <LaporanPanel />
        </div>
        <div className="w-[60%]">
          <VideoPlayer />
        </div>
      </div>
      <RunningText />
    </div>
  );
}

export default App;
