"use client";

import DynamicFormFields from "@/components/DynamicFormView";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useDialog from "@/hooks/ui/use-dialog";
import {
  useBedEditStore,
  useBedManagementTabStore,
  useVisualisasiBedStore,
  useWaitingListBedStore,
} from "@/stores/management/bed/useBedManagementStore";
import {
  useKamarStore,
  useKelasKamarStore,
  useRuangListStore,
} from "@/stores/master/useMasterStore";
import { buildQueryString } from "@/utils/buildQueryString";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import RightPanelVisualisasi from "./RightPanelVisualisasi";
import VisualisasiArea from "./VisualisasiArea";
import { getVisualisasiFields } from "./VisualisasiFields";

const VisualisasiLayout = ({ mode = "default", onSelectBed, data }) => {
  const {
    handleSubmit,
    formState: { errors },
    getValues,
    control,
  } = useForm({
    defaultValues: {
      ruang_id: null,
      kamar_id: null,
      kelas: null,
      tag_bed: null,
    },
  });
  const { updateWaitingListBed } = useWaitingListBedStore();
  const { fetchVisualisasiBed, detailBed } = useVisualisasiBedStore();
  const ruangId = useWatch({ control, name: "ruang_id" });
  const { kelasKamar } = useKelasKamarStore();
  const { ruangList } = useRuangListStore();
  const { fetchKamar, kamar } = useKamarStore();
  const { setSelectedTab } = useBedManagementTabStore();
  const { close } = useDialog();

  const fields = getVisualisasiFields(kelasKamar, kamar, ruangList);

  useEffect(() => {
    if (ruangId) {
      const params = buildQueryString({ ruang_id: ruangId });
      fetchKamar(params);
    }
  }, [ruangId]);

  const onSubmit = (data) => {
    const queryString = buildQueryString(data);
    fetchVisualisasiBed(queryString);
  };

  const handleClick = async (bed) => {
    const { fetchBedWaiting, fetchBedExist } = useBedEditStore.getState();
    await fetchBedExist(bed?.id_bed);
    await fetchBedWaiting(bed?.id_bed);
  };

  const handleAlihBed = async () => {
    if (!detailBed || !data) return;
    const remark = getValues("remark");

    const payload = {
      bed_id: detailBed.data_bed?.id_bed,
      date_start: data.date_start,
      date_estimated_discharge: data.data_kunjungan?.date_estimated_discharge,
      id_kunjungan: data.data_kunjungan?.id_registrasi,
      nama_pasien: data.data_kunjungan?.nama_pasien,
      is_booking: false,
      remark: remark,
    };

    try {
      await updateWaitingListBed({ ...payload, id: data.id });
      close();
    } catch (err) {
      console.error("Gagal alih bed:", err);
    }
  };

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3">
              <DynamicFormFields
                fields={fields}
                control={control}
                errors={errors}
                gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              />
            </div>
            <div className="flex items-center w-full">
              <Button
                type="submit"
                variant="primary1"
                className="w-full"
                size="sm"
              >
                Cari
              </Button>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-9 border-2 border-dashed rounded-lg h-[550px] flex items-center justify-center text-gray-400">
            <VisualisasiArea />
          </div>

          <div className="col-span-3 space-y-2">
            <RightPanelVisualisasi mode={mode} />
            {detailBed && mode !== "alihBed" && (
              <Button
                onClick={() => {
                  if (mode === "edit" && onSelectBed) {
                    onSelectBed(detailBed.data_bed);
                  } else {
                    setSelectedTab(0, "DATA BED");
                    handleClick(detailBed.data_bed);
                  }
                }}
                className="w-full"
                variant="primary1"
              >
                {mode === "edit" ? "Simpan" : "Lihat Monitoring Bed"}
              </Button>
            )}
          </div>
        </div>
        {mode === "alihBed" && (
          <div className="mt-4">
            <p className="text-xs text-gray-500">Catatan / Keterangan</p>
            <Textarea
              {...control.register("remark")}
              placeholder="Tuliskan catatan..."
            />
            <div className="flex items-center justify-center mt-2">
              <Button
                onClick={handleAlihBed}
                className="w-full"
                variant="primary1"
              >
                Simpan
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VisualisasiLayout;
