"use client";

import { downloadExamplePdf } from "@/lib/PDF/pdf";
import { Download } from "lucide-react";

interface DownloadProps {
  id: string;
}

export function ExportPDFDocument({ id }: DownloadProps) {
  const exportPDF = () => {
    try {
      downloadExamplePdf();
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <button
      onClick={() => {
        exportPDF();
      }}
      className="flex items-center justify-center gap-4 rounded-md
  border border-gray-300 px-4 py-1 bg-slate-100 cursor-pointer text-black hover:bg-slate-200"
    >
      <Download className="w-4 h-4 text-gray-800" />
      ดาวน์โหลดเอกสาร
    </button>
  );
}
