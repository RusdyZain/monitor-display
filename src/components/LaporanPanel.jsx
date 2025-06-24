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
    <div
      ref={containerRef}
      className="h-full overflow-y-scroll p-4 bg-gray-900 text-white"
    >
      <Document
        file="/pdfs/Laporan.pdf"
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(err) => console.error("PDF load error:", err)}
        loading={<p>Memuat PDF...</p>}
        error={<p>Gagal memuat PDF</p>}
      >
        {Array.from(new Array(numPages), (_, i) => (
          <Page
            key={i}
            pageNumber={i + 1}
            width={350}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
};

export default LaporanPanel;
