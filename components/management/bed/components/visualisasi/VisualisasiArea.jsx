"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  useVisualisasiBedStore,
} from "@/stores/management/bed/useBedManagementStore";
import React from "react";

const kondisiColor = {
  1: "bg-yellow-200 text-yellow-800 border-yellow-500",
  2: "bg-green-200 text-green-800 border-green-500",
  3: "bg-red-200 text-red-800 border-red-500",
};

const VisualisasiArea = () => {
  const {
    dataVisualisasiBed,
    setSelectedRow,
    fetchDetailBed,
    selectedRow,
  } = useVisualisasiBedStore();

  const handleCardClick = async (bed) => {
    setSelectedRow(bed);
    await Promise.all([fetchDetailBed(bed.id_bed)]);
  };

  return (
    <div className="w-full">
      <div className="overflow-y-auto p-4 h-[550px]">
        {dataVisualisasiBed?.body?.length ? (
          <div className="space-y-6">
            {dataVisualisasiBed.body.map((kamar) => (
              <div key={kamar.id_kamar} className="space-y-2">
                <h3 className="font-semibold text-gray-700 border-b pb-1">
                  {kamar.nama_kamar}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {kamar.data_bed.map((bed) => {
                    const isSelected = selectedRow?.id_bed === bed.id_bed;

                    return (
                      <Card
                        key={bed.id_bed}
                        onClick={() => handleCardClick(bed)}
                        className={`cursor-pointer border-2 transition hover:scale-105
                          ${
                            isSelected
                              ? "bg-blue-200 text-blue-800 border-blue-500"
                              : kondisiColor[bed.kondisi_bed]
                          }
                          ${!bed.status_bed ? "opacity-50" : ""}`}
                      >
                        <CardContent className="p-3 text-center">
                          <p className="font-bold">{bed.nama_bed}</p>
                          <p className="text-xs">{bed.nama_kelas}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">Belum ada data</p>
        )}
      </div>
    </div>
  );
};

export default VisualisasiArea;
