type SimpleRow = { left: string; right: string };

export function SimpleTable({
  headers,
  rows,
}: {
  headers: { left: string; right: string };
  rows: SimpleRow[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-300 text-left">
            <th className="py-4 pr-3 sm:pr-6 font-serif font-normal text-xs sm:text-sm uppercase tracking-wide text-neutral-600 w-1/3">
              {headers.left}
            </th>
            <th className="py-4 font-serif font-normal text-xs sm:text-sm uppercase tracking-wide text-neutral-600">
              {headers.right}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-neutral-200 align-top">
              <td className="py-6 pr-3 sm:pr-6 font-serif italic text-base sm:text-lg text-neutral-900">
                {row.left}
              </td>
              <td className="py-6 text-neutral-800 leading-relaxed">{row.right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}