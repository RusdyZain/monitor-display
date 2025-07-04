import { Document, Page } from "react-pdf";
import { useEffect, useRef, useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

const LaporanPanel = () => {
  const [numPages, setNumPages] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      container.scrollTop += 1;

      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight
      ) {
        container.scrollTop = 0;
      }
    }, 50);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="h-[100%] rounded-xl border-8 border-[#352c29] my-2 mx-2 bg-gray-900 text-white">
      <div className="bg-[#352c29] text-center py-2 font-extrabold text-xl">
        LAPORAN REALISASI SP2D TA 2025
      </div>
      <div
        ref={containerRef}
        className="overflow-y-scroll px-4"
        style={{
          height: "calc(100% - 2.5rem)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <Document
          file="/pdfs/Laporan.pdf"
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={(err) => console.error("PDF load error:", err)}
          loading={<p>Memuat PDF...</p>}
          error={<p>Gagal memuat PDF</p>}
          className="flex flex-col items-center"
        >
          {Array.from(new Array(numPages), (_, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              scale={0.59}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default LaporanPanel;
