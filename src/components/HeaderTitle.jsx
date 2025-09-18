// File: src/components/HeaderTitle.jsx
import React, { useEffect, useState } from "react";

const HeaderTitle = () => {
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
    <div className="w-full flex items-center justify-between bg-gradient-to-r from-[#352c29] to-[#009b4d] text-white px-4 py-2">
      {/* Kiri - Tanggal */}
      <div className="text-left">
        <div className="text-4xl font-extrabold">{hari}</div>
        <div className="text-lg font-bold">{tanggal}</div>
      </div>

      {/* Tengah - Logo, Nama Instansi, Alamat */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-4">
          <img src="/dokkes.png" alt="Logo NTB" className="h-14 w-auto" />
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              BIDDOKKES POLDA NTB
            </h1>
          </div>
        </div>
        <p className="mt-1 text-lg">
          Jl. Majapahit No.12A, Taman Sari, Kec. Ampenan, Kota Mataram, Nusa
          Tenggara Bar. 83112{" "}
        </p>
      </div>

      {/* Kanan - Jam */}
      <div className="text-right">
        <div className="text-4xl font-extrabold">{jam}</div>
        <div className="text-lg font-bold">WITA</div>
      </div>
    </div>
  );
};

export default HeaderTitle;
