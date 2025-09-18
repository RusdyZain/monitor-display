const RunningText = () => (
  <div className="relative w-full bg-gradient-to-r from-[#f8d34b] via-[#f4c533] to-[#f8d34b] py-2.5 shadow-[0_-18px_50px_-40px_rgba(0,0,0,0.9)]">
    <div className="mx-auto flex w-full items-center gap-3 overflow-hidden px-5">
      <span className="shrink-0 rounded-full bg-black/80 px-3 py-1 text-[0.65rem] font-bold tracking-[0.45em] text-yellow-300">
        Info
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-sm font-semibold uppercase tracking-wide text-black md:text-base">
          Selamat datang di Biddokkes Polda NTB – Bidang Kedokteran & Kesehatan Polda NTB, melayani pelayanan kedokteran forensik, DVI & kesehatan kepolisian.
        </div>
      </div>
    </div>
  </div>
);
export default RunningText;
