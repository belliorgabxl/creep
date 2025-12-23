"use client";

import * as React from "react";
import { BadgeCreateFormProject } from "../Helper";
import { ExpectParams } from "@/dto/projectDto";
import { Trash } from "lucide-react";

type Props = {
  value: ExpectParams;
  onChange: (v: ExpectParams) => void;
};

export default function ExpectForm({ value, onChange }: Props) {
  const update = (idx: number, text: string) => {
    const clone = [...value.results];
    clone[idx] = {
      ...clone[idx],
      description: text,
    };
    onChange({ results: clone });
  };

  const addRow = () => {
    onChange({
      results: [
        ...value.results,
        {
          description: "",
          type: "expectation",
        },
      ],
    });
  };

  const removeRow = (idx: number) => {
    const clone = value.results.filter((_, i) => i !== idx);
    onChange({ results: clone });
  };

  return (
    <div className="space-y-4">
      <BadgeCreateFormProject title="ผลที่คาดว่าจะได้รับ" />
      <h2 className="font-medium text-gray-800">ผลที่คาดว่าจะได้รับ</h2>

      <div className="space-y-4">
        {value.results.map((item, idx) => (
          <div key={idx} className="relative">
            <textarea
              value={item.description}
              onChange={(e) => update(idx, e.target.value)}
              className="min-h-[120px] w-full rounded-lg border border-gray-300 py-2 px-4"
              placeholder={`ข้อที่ ${idx + 1}`}
            />

            {value.results.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(idx)}
                className="absolute -top-2 -right-2 rounded-full bg-red-400 text-white p-2 hover:bg-red-600 flex items-center justify-center"
              >
                <Trash className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addRow}
          className="rounded-md px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          + เพิ่มผลที่คาดว่าจะได้รับ
        </button>
      </div>
    </div>
  );
}
