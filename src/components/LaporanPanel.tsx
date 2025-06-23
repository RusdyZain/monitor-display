import { Document, Page } from "react-pdf";
import { useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

const LaporanPanel = () => {
  const [numPages, setNumPages] = useState(0);

  return (
    <div className="pdf-container">
      <Document
        file="/Laporan.pdf"
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
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
