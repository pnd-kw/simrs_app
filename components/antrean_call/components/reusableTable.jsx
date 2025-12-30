import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";

export function ReusableTable({
  columns = [],
  data = [],
  title = "-",
  limitOptions = [5, 10, 20],
  renderAction,
  headerColor = "bg-[#B9B9B9]",
  isLoading = false,
}) {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(limitOptions[0]);

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.accessor];
        return String(val).toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [data, search, columns]);

  const displayedData = filteredData.slice(0, limit);

  
  return (
    <Card className="p-0 w-full">
      <div className="flex flex-col gap-4 h-full">
        <div
          className={`p-2 flex items-center rounded-t-md text-white ${headerColor}`}
        >
          <div className="font-semibold text-sm uppercase">{title}</div>
          <div className="ml-auto">
            <Input
              placeholder="Cari"
              className="w-[180px] rounded bg-white text-black placeholder:text-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-center w-[40px]">NO</TableHead>
                {renderAction && (
                  <TableHead className="text-center w-[60px]">ACT</TableHead>
                )}
                {columns.map((col) => (
                  <TableHead key={col.accessor}>{col.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (renderAction ? 2 : 1)}
                    className="text-center"
                  >
                    <span className="animate-pulse text-gray-500">
                      Memuat data...
                    </span>
                  </TableCell>
                </TableRow>
              ) : displayedData.length > 0 ? (
                displayedData.map((row, index) => (
                  <TableRow key={row.id ?? index}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    {renderAction && (
                      <TableCell className="text-center">
                        {renderAction(row)}
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.accessor}>
                        {row[col.accessor]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (renderAction ? 2 : 1)}
                    className="text-center"
                  >
                    Tidak ada data ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs px-2 py-1 border-t">
        <div className="flex items-center gap-1">
          Tampilkan
          <select
            className="border px-2 py-1 rounded text-xs"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
          >
            {limitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          Data
        </div>
        <div>
          Menampilkan {displayedData.length} dari {filteredData.length} data
        </div>
      </div>
    </Card>
  );
}
