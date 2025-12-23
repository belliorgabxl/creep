import { LoaderCircle } from "lucide-react";
import React from "react";

export function LoadData() {
  return (
    <div className="w-full py-10 h-full grid place-items-center">
      <div className="flex items-center justify-center gap-5 text-indigo-600 text-xl">
        <LoaderCircle className=" animate-spin duration-300 text-indigo-500 h-10 w-10" />
        กำลังโหลดข้อมูล
      </div>
    </div>
  );
}

