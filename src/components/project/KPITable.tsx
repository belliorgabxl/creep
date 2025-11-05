"use client";
import React, { useMemo, useState } from "react";

export type KPIRow = {
  id: number;
  activity: string;
  period: string;
  owner: string;
};

type Props = {
  value?: KPIRow[];
  onChange?: (rows: KPIRow[]) => void;
  defaultRows?: KPIRow[];
  className?: string;
  hideRemove?: boolean;
};

export default function KPIActivitiesTable({
  value,
  onChange,
  defaultRows,
  className,
  hideRemove = false,
}: Props) {
  const [internal, setInternal] = useState<KPIRow[]>(
    defaultRows ?? [{ id: 1, activity: "", period: "", owner: "" }]
  );

  const controlled = value !== undefined;
  const rows = controlled ? (value as KPIRow[]) : internal;

  const setRows = (next: KPIRow[]) => {
    if (!controlled) setInternal(next);
    onChange?.(next);
  };

  const addRow = () => {
    setRows([
      ...rows,
      { id: rows.length + 1, activity: "", period: "", owner: "" },
    ]);
  };

  const removeRow = (id: number) => {
    const filtered = rows.filter((r) => r.id !== id);
    const reindexed = filtered.map((r, i) => ({ ...r, id: i + 1 }));
    setRows(reindexed);
  };

  const updateRow = (index: number, field: keyof KPIRow, value: string) => {
    const next = [...rows];
    next[index] = { ...next[index], [field]: value } as KPIRow;
    setRows(next);
  };

  const actions = useMemo(() => ({ addRow, removeRow, updateRow }), [rows]);

  return (
    <div className={["space-y-3", className].filter(Boolean).join(" ")}>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-20 border border-gray-300 px-3 py-2 text-left">
                ลำดับ
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                กิจกรรม
              </th>
              <th className="w-48 border border-gray-300 px-3 py-2 text-left">
                ระยะเวลา
              </th>
              <th className="w-64 border border-gray-300 px-3 py-2 text-left">
                ผู้รับผิดชอบ
              </th>
              {!hideRemove && (
                <th className="w-16 border border-gray-300 px-3 py-2" />
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  {row.id}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={row.activity}
                    onChange={(e) =>
                      updateRow(index, "activity", e.target.value)
                    }
                    placeholder="ระบุกิจกรรม"
                    className="w-full focus:outline-none"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={row.period}
                    onChange={(e) => updateRow(index, "period", e.target.value)}
                    placeholder="เช่น 1 ต.ค. 68 - 15 ต.ค. 68"
                    className="w-full focus:outline-none"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={row.owner}
                    onChange={(e) => updateRow(index, "owner", e.target.value)}
                    placeholder="ชื่อผู้รับผิดชอบ"
                    className="w-full focus:outline-none"
                  />
                </td>
                {!hideRemove && (
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="px-2 py-1 rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
                      disabled={rows.length === 1}
                      title={
                        rows.length === 1 ? "ต้องมีอย่างน้อย 1 แถว" : "ลบแถวนี้"
                      }
                    >
                      ลบ
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right">
        <button
          type="button"
          onClick={addRow}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          + เพิ่มแถว
        </button>
      </div>
    </div>
  );
}
