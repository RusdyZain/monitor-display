import HeaderTitle from "./components/HeaderTitle";
import LaporanPanel from "./components/LaporanPanel";
import VideoPlayer from "./components/VideoPlayer";
import RunningText from "./components/RunningText";
import "./index.css";

function App() {
  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden font-sans bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <HeaderTitle />
      <div className="flex flex-1 flex-row">
        <div className="w-[55%]">
          <div className="flex flex-col h-[10%] overflow-hidden">
            <LaporanPanel />
          </div>
        </div>
        <div className="w-[45%]">
          <VideoPlayer />
        </div>
      </div>
      <RunningText />
    </div>
  );
}

export default App;
