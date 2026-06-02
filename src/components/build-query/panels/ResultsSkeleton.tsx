import { FIELD_MAP } from "@/components/build-query/data";
import { RESULT_COLS } from "..";

const ResultsSkeleton = () => {
  return (
    <table className="w-full border-collapse text-[12.5px]">
      <thead>
        <tr>
          {RESULT_COLS.map((c) => (
            <th
              key={c}
              className="sticky top-0 z-2 whitespace-nowrap border-b border-border bg-surface px-3.5 py-2.25 text-left font-jetbrains-mono text-[11px] font-semibold text-faint"
            >
              {FIELD_MAP[c].label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 7 }).map((_, i) => (
          <tr key={i} className="animate-fade-up">
            {RESULT_COLS.map((c) => (
              <td key={c} className="border-b border-border-soft px-3.5 py-2.25">
                <span
                  className="inline-block h-2.75 animate-pulse rounded bg-surface-3"
                  style={{
                    width: `${50 + ((i * 17 + c.length * 7) % 45)}%`,
                  }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsSkeleton;
