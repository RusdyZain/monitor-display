import HeaderTitle from "./components/HeaderTitle";
import LaporanPanel from "./components/LaporanPanel";
import VideoPlayer from "./components/VideoPlayer";
import RunningText from "./components/RunningText";
import MotoTagline from "./components/MotoTagline";
import "./index.css";

function App() {
  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden font-sans bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <HeaderTitle />
      <div className="flex flex-1 flex-row h-[80%]">
        <div className="w-[55%]">
          <div className="h-[50%]">
            <LaporanPanel />
          </div>
          <div className="h-[45%]">
            <LaporanPanel />
          </div>
        </div>

        <div className="w-[45%]">
          <VideoPlayer />
          <MotoTagline />
        </div>
      </div>
      <RunningText />
    </div>
  );
}

export default App;
