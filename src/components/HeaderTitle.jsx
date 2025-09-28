// File: src/components/HeaderTitle.jsx
import React, { useEffect, useState } from "react";

const HeaderTitle = ({ onConfigure }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hari = time.toLocaleDateString("id-ID", { weekday: "long" });
  const tanggal = time.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const jam = time.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="relative w-full bg-gradient-to-r from-[#352c29] via-[#1f4d3a] to-[#009b4d] px-6 py-4 text-white shadow-[0_20px_55px_-30px_rgba(0,0,0,0.85)]">
      <div className="flex w-full items-center justify-between gap-6 rounded-2xl border border-white/15 bg-white/10 px-6 py-3 backdrop-blur">
        {/* Kiri - Tanggal */}
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold uppercase tracking-[0.45em] text-white/70">
            {hari}
          </span>
          <span className="text-xl font-bold md:text-3xl">{tanggal}</span>
        </div>

        {/* Tengah - Logo, Nama Instansi, Alamat */}
        <div className="flex max-w-3xl flex-1 flex-col items-center text-center md:flex-row md:items-center md:justify-center md:gap-5">
          <img
            src="/dokkes.png"
            alt="Logo NTB"
            className="h-14 w-auto drop-shadow"
          />
          <div className="mt-3 flex flex-col md:mt-0">
            <h1 className="text-2xl font-extrabold leading-tight md:text-4xl">
              BIDDOKKES POLDA NTB
            </h1>
            <p className="mt-1 text-xs font-medium text-white/80 md:text-sm">
              Jl. Majapahit No.12A, Taman Sari, Kec. Ampenan, Kota Mataram, Nusa
              Tenggara Barat 83112
            </p>
          </div>
        </div>

        {/* Kanan - Jam dan tombol */}
        <div className="flex flex-col items-end gap-2 leading-tight md:flex-row md:items-center md:gap-4">
          {onConfigure ? (
            <button
              type="button"
              onClick={onConfigure}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:bg-white/30 hover:text-white md:px-4"
            >
              <span className="block h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
              Pengaturan
            </button>
          ) : null}
          <div className="flex flex-col items-end leading-tight">
            <span className="text-2xl font-extrabold md:text-4xl">{jam}</span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-white/70 md:text-sm">
              Wita
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderTitle;

