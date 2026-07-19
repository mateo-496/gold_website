import Link from "next/link";

type CustomsRow = {
  range: string;
  requirement: string;
  formLabel?: string;
  formUrl?: string;
};

export function CustomsTable({
  headers,
  rows,
}: {
  headers: { range: string; requirement: string; form: string };
  rows: CustomsRow[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-300 text-left">
            <th className="py-4 pr-6 font-serif font-normal text-sm uppercase tracking-wide text-neutral-600">
              {headers.range}
            </th>
            <th className="py-4 pr-6 font-serif font-normal text-sm uppercase tracking-wide text-neutral-600">
              {headers.requirement}
            </th>
            <th className="py-4 font-serif font-normal text-sm uppercase tracking-wide text-neutral-600">
              {headers.form}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-neutral-200 align-top">
              <td className="py-6 pr-6 font-serif italic text-lg whitespace-nowrap text-neutral-900">
                {row.range}
              </td>
              <td className="py-6 pr-6 text-neutral-800 leading-relaxed max-w-md">
                {row.requirement}
              </td>
              <td className="py-6 whitespace-nowrap">
                {row.formUrl ? (
                  <Link
                    href={row.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:opacity-70 transition-opacity text-sm"
                  >
                    {row.formLabel} ↗
                  </Link>
                ) : (
                  <span className="text-neutral-500 text-sm">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}