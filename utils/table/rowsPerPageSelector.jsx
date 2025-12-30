
export default function RowsPerPageSelector({
  value,
  onChange,
  total,
  options,
}) {
  return (
    <div className="flex items-center text-xs">
      <label htmlFor="rows-per-page" className="text-stone-900 mx-4">
        Tampilkan
      </label>
      <select
        id="rows-per-page"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-stone-300 py-1 px-4 pr-4 bg-white text-slate-950 focus:outline-none"
      >
        {options?.map((opt) => (
          <option className="text-slate-950" key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span className="text-stone-900 mx-4">
        {`Data | Menampilkan 1 sampai ${value} dari ${total} Data`}
      </span>
    </div>
  );
}
