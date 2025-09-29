// File: src/components/AssetSettings.jsx
import { useEffect, useMemo, useRef, useState } from "react";

const formFields = [
  {
    key: "primaryPdf",
    label: "PDF utama",
    placeholder: "/pdfs/Laporan.pdf",
    helper: "Tampilkan pada panel utama.",
    accept: ".pdf,application/pdf",
    uploadType: "pdf",
  },
  {
    key: "secondaryPdf",
    label: "PDF kedua (opsional)",
    placeholder: "/pdfs/Laporan.pdf",
    helper: "Kosongkan untuk memakai PDF utama.",
    accept: ".pdf,application/pdf",
    uploadType: "pdf",
  },
  {
    key: "video",
    label: "Video profil",
    placeholder: "/videos/Video.mp4",
    helper: "Format MP4 (atau WebM) disarankan untuk kompatibilitas tinggi.",
    accept: "video/*",
    uploadType: "video",
  },
  {
    key: "runningText",
    label: "Teks berjalan",
    placeholder: "Selamat datang di Biddokkes Polda NTB - Bidang Kedokteran & Kesehatan Polda NTB, melayani pelayanan kedokteran forensik, DVI & kesehatan kepolisian.",
    helper: "Muncul pada strip informasi berjalan di bagian bawah layar.",
    multiline: true,
    maxLength: 320,
    rows: 3,
  },
];

const normalizeAssets = (assets) => {
  if (!assets || typeof assets !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(assets)
      .filter(([, value]) => typeof value === "string")
      .map(([key, value]) => [key, value.trim()])
  );
};

const statusStyles = {
  success: "bg-emerald-500/20 text-emerald-200",
  error: "bg-rose-500/20 text-rose-200",
  loading: "bg-white/10 text-white/70",
};

const AssetSettings = ({ assets, onClose, onSave }) => {
  const initialState = useMemo(
    () => ({ primaryPdf: "", secondaryPdf: "", video: "", runningText: "", ...normalizeAssets(assets) }),
    [assets]
  );
  const [formState, setFormState] = useState(initialState);
  const [status, setStatus] = useState(null);
  const [uploadingKey, setUploadingKey] = useState(null);
  const fileInputsRef = useRef({});

  useEffect(() => {
    setFormState(initialState);
  }, [initialState]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const triggerFileDialog = (key) => {
    const input = fileInputsRef.current[key];
    if (input) {
      input.click();
    }
  };

  const handleFileSelected = async (key, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const field = formFields.find((item) => item.key === key);
    if (!field) {
      return;
    }

    setUploadingKey(key);
    setStatus({ type: "loading", message: `Mengunggah ${field.label}...` });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/upload?type=${field.uploadType}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Upload gagal dengan status ${response.status}`;
        try {
          const errorBody = await response.json();
          if (errorBody?.error) {
            errorMessage = errorBody.error;
          }
        } catch {
          // abaikan body yang tidak valid
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data?.path) {
        throw new Error("Respons server tidak valid.");
      }

      setFormState((prev) => ({ ...prev, [key]: data.path }));
      setStatus({
        type: "success",
        message: `${field.label} berhasil diunggah. Klik Simpan untuk menerapkan ke tampilan utama.`,
      });
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Upload gagal." });
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Menyimpan..." });

    try {
      const payload = normalizeAssets(formState);
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server mengembalikan status ${response.status}`);
      }

      let body = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }

      const nextAssets = normalizeAssets(body?.assets) || payload;
      onSave(nextAssets);
      setStatus({ type: "success", message: "Konfigurasi tersimpan." });
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Gagal menyimpan." });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/30 bg-slate-900/95 p-6 text-white shadow-[0_35px_80px_-35px_rgba(0,0,0,0.9)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 px-2 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:bg-white/20 hover:text-white"
        >
          Tutup
        </button>
        <h2 className="mb-5 text-2xl font-bold uppercase tracking-[0.35em] text-white/80">
          Pengaturan Aset
        </h2>
        <p className="mb-4 text-sm text-white/60">
          Unggah file dari komputer Anda atau masukkan jalur relatif terhadap server (contoh `/pdfs/Laporan.pdf`).
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formFields.map(
            ({
              key,
              label,
              placeholder,
              helper,
              accept,
              uploadType,
              multiline,
              rows = 3,
              maxLength,
            }) => {
              const containerClasses = uploadType
                ? "flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
                : "flex flex-col gap-2";
              const commonInputClasses =
                "flex-1 rounded-2xl border border-white/20 bg-slate-900/70 px-4 py-3 text-sm text-white shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40";
              return (
                <div key={key} className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                    {label}
                  </span>
                  <div className={containerClasses}>
                    {multiline ? (
                      <textarea
                        name={key}
                        value={formState[key] ?? ""}
                        onChange={handleChange}
                        placeholder={placeholder}
                        rows={rows}
                        maxLength={typeof maxLength === "number" ? maxLength : undefined}
                        className={`${commonInputClasses} min-h-[7rem] resize-y leading-relaxed`}
                      />
                    ) : (
                      <input
                        type="text"
                        name={key}
                        value={formState[key] ?? ""}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={commonInputClasses}
                      />
                    )}
                    {uploadType ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => triggerFileDialog(key)}
                          disabled={uploadingKey === key}
                          className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80 transition hover:bg-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {uploadingKey === key ? "Mengunggah..." : "Unggah"}
                        </button>
                        <input
                          ref={(node) => {
                            if (node) {
                              fileInputsRef.current[key] = node;
                            }
                          }}
                          type="file"
                          accept={accept}
                          className="hidden"
                          onChange={(event) => handleFileSelected(key, event)}
                        />
                      </div>
                    ) : null}
                  </div>
                  <span className="text-xs text-white/50">{helper}</span>
                </div>
              );
            }
          )}
          <div className="mt-2 flex items-center justify-between gap-4">
            <div className="text-xs text-white/60">
              Setelah menyimpan, tampilan utama otomatis memakai jalur terbaru.
            </div>
            <button
              type="submit"
              className="inline-flex min-w-[7rem] justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-950 transition hover:bg-emerald-400"
            >
              Simpan
            </button>
          </div>
        </form>
        {status ? (
          <div className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
            statusStyles[status.type] ?? statusStyles.loading
          }`}
          >
            {status.message}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AssetSettings;

