import { Document, Page } from "react-pdf";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

const LaporanPanel = ({
  title = "LAPORAN REALISASI SP2D TA 2025",
  subtitle,
  file = "/pdfs/Laporan.pdf",
  pageScale,
  maxPages,
  autoScroll = true,
  scrollStep = 1,
  scrollDelay = 45,
  className = "",
}) => {
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    if (typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const element = contentRef.current;
    if (!element) {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const nextWidth = Math.round(entry.contentRect.width);
      setPageWidth((prev) => (prev !== nextWidth ? nextWidth : prev));
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoScroll) return undefined;

    const scrollInterval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      container.scrollTop += scrollStep;

      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - scrollStep
      ) {
        container.scrollTop = 0;
      }
    }, scrollDelay);

    return () => clearInterval(scrollInterval);
  }, [autoScroll, scrollDelay, scrollStep]);

  const pagesToRender = useMemo(() => {
    if (!numPages) return [];
    const total = maxPages ? Math.min(maxPages, numPages) : numPages;
    return Array.from({ length: total }, (_, index) => index + 1);
  }, [maxPages, numPages]);

  const pageProps = useMemo(() => {
    if (pageScale != null) {
      return { scale: pageScale };
    }

    if (pageWidth) {
      return { width: pageWidth };
    }

    return {};
  }, [pageScale, pageWidth]);

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/30 bg-white/10 text-white shadow-[0_25px_70px_-35px_rgba(0,0,0,0.85)] backdrop-blur ${className}`.trim()}
    >
      <div className="flex flex-row items-center gap-3 border-b border-white/20 bg-gradient-to-r from-[#352c29] via-[#1f4d3a] to-[#009b4d] px-5 py-3">
        <h2 className="text-xl font-extrabold uppercase tracking-wide drop-shadow-sm">
          {title}
        </h2>
        {subtitle ? (
          <p className="ml-auto text-right text-xs font-medium text-white/80 md:text-sm">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="relative flex-1 overflow-hidden px-4 py-4">
        <div
          ref={containerRef}
          className="custom-scroll relative h-full overflow-y-auto rounded-2xl bg-black/60 p-4 shadow-inner"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>
            {`
              .custom-scroll::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          <div ref={contentRef} className="flex w-full flex-col">
            <Document
              file={file}
              onLoadSuccess={({ numPages: pages }) => setNumPages(pages)}
              onLoadError={(err) => console.error("PDF load error:", err)}
              loading={
                <p className="text-center text-sm text-white/60">Memuat PDF...</p>
              }
              error={
                <p className="text-center text-sm text-red-300">
                  Gagal memuat PDF
                </p>
              }
              className="flex w-full flex-col gap-8"
            >
              {pagesToRender.map((pageNumber) => (
                <div key={pageNumber} className="flex w-full justify-center">
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    {...pageProps}
                  />
                </div>
              ))}
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanPanel;

