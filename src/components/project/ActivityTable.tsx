"use client"
import { useState } from "react";

type BudgetRow = { id: number; item: string; amount: string; note: string };

export function ActivityBudgetTable() {
  const [rows, setRows] = useState<BudgetRow[]>([
    { id: 1, item: "", amount: "", note: "" },
  ]);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: prev.length + 1, item: "", amount: "", note: "" },
    ]);
  };

  const removeRow = (id: number) => {
    setRows((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, idx) => ({ ...r, id: idx + 1 }));
    });
  };

  const updateRow = (idx: number, field: keyof BudgetRow, value: string) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const total = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-center w-1/2">
                รายการ
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center w-1/4">
                จำนวนเงิน (บาท)
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center w-1/4">
                หมายเหตุ
              </th>
              <th className="border border-gray-300 px-2 py-2 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={row.item}
                    onChange={(e) => updateRow(idx, "item", e.target.value)}
                    placeholder={`ระบุรายการ (ลำดับ ${row.id})`}
                    className="w-full focus:outline-none"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={row.amount}
                    onChange={(e) => updateRow(idx, "amount", e.target.value)}
                    placeholder="0.00"
                    className="w-28 text-center focus:outline-none"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={row.note}
                    onChange={(e) => updateRow(idx, "note", e.target.value)}
                    placeholder="หมายเหตุ"
                    className="w-full focus:outline-none"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="px-2 py-1 rounded-md text-red-600 hover:bg-red-50"
                    disabled={rows.length === 1}
                    title={
                      rows.length === 1 ? "ต้องมีอย่างน้อย 1 แถว" : "ลบแถวนี้"
                    }
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-50 text-right">
                รวม
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center font-semibold bg-gray-50">
                {total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td
                className="border border-gray-300 px-4 py-2 bg-gray-50"
                colSpan={2}
              ></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">แถวทั้งหมด: {rows.length}</div>
        <button
          type="button"
          onClick={addRow}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          + เพิ่มรายการ
        </button>
      </div>
    </div>
  );
}
