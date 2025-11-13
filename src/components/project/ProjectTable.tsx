
import { Project } from "@/dto/projectDto";
import * as React from "react";
import {
  BadgeTiny,
  formatBaht,
  formatThaiDateTime,
  StatusBadge,
  Td,
} from "./Helper";
import Link from "next/link";
import { useRouter } from "next/navigation";
export function ProjectTable({ projects }: { projects: Project[] }) {
  const router = useRouter();

  const go = (id: string) => router.push(`/organizer/projects/details/${id}`);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <tbody className="divide-y divide-gray-100">
          {projects.map((p) => (
            <tr
              key={p.id}
              className="hover:bg-gray-50/60 cursor-pointer"
              onClick={() => go(p.id)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  go(p.id);
                }
              }}
            >
              <Td>
                <Link
                  href={`/organizer/projects/details/${p.id}`}
                  className="block font-medium text-gray-900 hover:underline line-clamp-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {p.name}
                </Link>
                {p.objective && (
                  <p
                    className="mt-1 text-xs text-gray-600 line-clamp-1"
                    title={p.objective}
                  >
                    {p.objective}
                  </p>
                )}
              </Td>

              {/* คอลัมน์อื่น ๆ เหมือนเดิม */}
              <Td className="text-center">
                {p.department ? (
                  <BadgeTiny title={p.department}>
                    <span className="line-clamp-1">{p.department}</span>
                  </BadgeTiny>
                ) : (
                  "—"
                )}
              </Td>
              <Td className="text-center">
                {p.durationMonths ? <span>{p.durationMonths} เดือน</span> : "—"}
              </Td>
              <Td className="text-center">
                <StatusBadge status={p.status} />
              </Td>
              <Td className="text-center">
                {p.budget != null ? formatBaht(p.budget) : "—"}
              </Td>
              <Td title={p.updatedAt}>
                <span className="line-clamp-1">
                  {formatThaiDateTime(p.updatedAt)}
                </span>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
