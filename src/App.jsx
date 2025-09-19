import HeaderTitle from "./components/HeaderTitle";
import LaporanPanel from "./components/LaporanPanel";
import VideoPlayer from "./components/VideoPlayer";
import RunningText from "./components/RunningText";
import MotoTagline from "./components/MotoTagline";
import "./index.css";

function App() {
  const lastUpdated = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative flex h-dvh w-screen flex-col overflow-hidden font-sans bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.png')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <HeaderTitle />
        <main className="flex-1 overflow-hidden px-6 pb-6 pt-4 min-h-0">
          <div className="grid h-full min-h-0 grid-cols-12 gap-4">
            <div className="col-span-12 flex min-h-0 flex-col gap-4 lg:col-span-7">
              <LaporanPanel
                subtitle={`Update terakhir: ${lastUpdated}`}
                className="flex-[3]"
                maxPages={1}
                pageScale={0.6}
                autoScroll={true}
              />
              <LaporanPanel
                title="Rincian Halaman Utama"
                subtitle="Ringkasan halaman pertama untuk peninjauan cepat"
                maxPages={1}
                pageScale={0.6}
                autoScroll={true}
                className="flex-[2]"
              />
            </div>
            <div className="col-span-12 flex min-h-0 flex-col gap-4 lg:col-span-5">
              <div className="flex-[3] overflow-hidden rounded-3xl border border-white/30 bg-white/10 p-5 shadow-[0_25px_70px_-35px_rgba(0,0,0,0.85)] backdrop-blur">
                <VideoPlayer />
              </div>
              <div className="flex-[2]">
                <MotoTagline />
              </div>
            </div>
          </div>
        </main>
        <RunningText />
      </div>
    </div>
  );
}

export default App;
