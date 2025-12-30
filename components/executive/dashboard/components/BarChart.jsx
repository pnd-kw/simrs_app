"use client";

import { useState, useEffect } from "react";
import { generateMockDataPendapatan } from "@/test/mock-api-pendapatan";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


const BarChartComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const mockRes = generateMockDataPendapatan();
      setData(mockRes.body);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full h-full px-2">
      <div className="flex w-full justify-between">
        <h2 className="text-2xl font-semibold mb-4">
          Pendapatan <span className="text-[#1BBB75]">1 Juni 2025</span> s/d{" "}
          <span className="text-[#1BBB75]">30 Juni 2025</span>{" "}
        </h2>
      </div>
      {loading ? (
        <div>Memuat data...</div>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              horizontal={true}
              vertical={false}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="hari"
              tickFormatter={(dateString) => dateString.split("-")[2]}
              axisLine={false}
            />
            <YAxis
              ticks={[850000000, 1700000000, 2550000000, 3400000000]}
              domain={[0, 3400000000]}
              width={90}
              tick={{ fontSize: 10 }}
              axisLine={false}
            />
            <Tooltip
              formatter={(value) => [
                `Rp ${value.toLocaleString()}`,
                "Pendapatan",
              ]}
            />
            <Bar dataKey="target_harian" fill="red1" name="Target" />
            <Bar dataKey="realisasi" fill="primary3" name="Realisasi" />
            <Bar dataKey="rata_rata_harian" fill="#F09F00" name="Rata-Rata" />
            <Bar
              dataKey="pendapatan_harian"
              fill="#0696D4"
              name="Pendapatan"
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div>Tidak ada data untuk tanggal yang dipilih.</div>
      )}
      <div className="flex justify-center gap-2">
        <div className="flex w-[10vw] h-[5vh] items-center gap-2">
          <div className="bg-red1 w-2 h-2" />
          <span className="text-red1 text-sm">Target harian</span>
        </div>
        <div className="flex w-[10vw] h-[5vh] items-center gap-2">
          <div className="bg-primary3 w-2 h-2" />
          <span className="text-primary3 text-sm">Realisasi</span>
        </div>
        <div className="flex w-[15vw] h-[5vh] items-center gap-2">
          <div className="bg-yellow1 w-2 h-2" />
          <span className="text-yellow1 text-sm">Rata-rata Pendapatan</span>
        </div>
        <div className="flex w-[15vw] h-[5vh] items-center gap-2">
          <div className="bg-blue1 w-2 h-2" />
          <span className="text-blue1 text-sm">Total Pendapatan</span>
        </div>
      </div>
    </div>
  );
};

export default BarChartComponent;
