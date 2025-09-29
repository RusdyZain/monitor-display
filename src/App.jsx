import { useEffect, useState } from "react";
import AssetSettings from "./components/AssetSettings";
import HeaderTitle from "./components/HeaderTitle";
import LaporanPanel from "./components/LaporanPanel";
import VideoPlayer from "./components/VideoPlayer";
import RunningText from "./components/RunningText";
import MotoTagline from "./components/MotoTagline";
import "./index.css";

const DEFAULT_ASSETS = {
  primaryPdf: "/pdfs/Laporan.pdf",
  secondaryPdf: "/pdfs/Laporan.pdf",
  video: "/videos/Video.mp4",
  runningText: "Selamat datang di Biddokkes Polda NTB - Bidang Kedokteran & Kesehatan Polda NTB, melayani pelayanan kedokteran forensik, DVI & kesehatan kepolisian.",
};

function App() {
  const [assets, setAssets] = useState(DEFAULT_ASSETS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAssets() {
      try {
        const response = await fetch("/api/assets", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (!cancelled && data && typeof data === "object") {
          const parsed = data.assets && typeof data.assets === "object" ? data.assets : data;
          setAssets((prev) => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.warn("Gagal memuat konfigurasi aset:", err);
      }
    }

    loadAssets();

    return () => {
      cancelled = true;
    };
  }, []);

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
        <HeaderTitle onConfigure={() => setIsSettingsOpen(true)} />
        <main className="flex-1 overflow-hidden px-6 pb-6 pt-4 min-h-0">
          <div className="grid h-full min-h-0 grid-cols-12 gap-4">
            <div className="col-span-12 flex min-h-0 flex-col gap-4 lg:col-span-7">
              <LaporanPanel
                file={assets.primaryPdf}
                subtitle={`Update terakhir: ${lastUpdated}`}
                className="flex-[3]"
                autoScroll
              />
              <LaporanPanel
                file={assets.secondaryPdf || assets.primaryPdf}
                title="Rincian Halaman Utama"
                subtitle="Ringkasan halaman pertama untuk peninjauan cepat"
                autoScroll
                className="flex-[2]"
              />
            </div>
            <div className="col-span-12 flex min-h-0 flex-col gap-4 lg:col-span-5">
              <div className="flex-[3] overflow-hidden rounded-3xl border border-white/30 bg-white/10 p-5 shadow-[0_25px_70px_-35px_rgba(0,0,0,0.85)] backdrop-blur">
                <VideoPlayer src={assets.video} />
              </div>
              <div className="flex-[2]">
                <MotoTagline />
              </div>
            </div>
          </div>
        </main>
        <RunningText text={assets.runningText} />
      </div>
      {isSettingsOpen ? (
        <AssetSettings
          assets={assets}
          onClose={() => setIsSettingsOpen(false)}
          onSave={(nextAssets) => setAssets((prev) => ({ ...prev, ...nextAssets }))}
        />
      ) : null}
    </div>
  );
}

export default App;

