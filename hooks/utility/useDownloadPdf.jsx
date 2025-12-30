import toastWithProgress from "@/utils/toast/toastWithProgress";
import { useCallback } from "react";

export function useDownloadPdf() {
  const downloadPdf = useCallback(async (apiFn, options) => {
    const { defaultFilename } = options;

    try {
      const res = await apiFn;
      if (res.status !== 200) throw new Error("Api error response");

      const disposition = res.headers["content-disposition"];
      let filename = defaultFilename;
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      const blob = res.data;
      const fileUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(fileUrl);
    } catch (err) {
      console.error("Failed to download pdf", err.message);
      toastWithProgress({
        title: "Terjadi kesalahan",
        description: "Gagal download PDF",
        duration: 3000,
        type: "error",
      });
    }
  }, []);

  return { downloadPdf };
}
