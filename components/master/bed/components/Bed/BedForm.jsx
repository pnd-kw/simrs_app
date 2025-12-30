import { postBed, updateBed } from "@/api_disabled/master/bed";
import DynamicFormFields from "@/components/DynamicFormView";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table } from "@/utils/table/table";
import { useBedStore } from "@/stores/master/useMasterStore";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { bedSchema, getBedCheckboxes, getBedFields } from "./BedFields";

const BedForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(bedSchema),
    defaultValues: {
      name: "",
      kelas_id: null,
      kelaskamarsirsonline: null,
      gol_golongankelasaplicares: null,
      ruang_aplicares: null,
      kamar_id: null,
      jenis_layanan_id: null,
      remark: "",
      icekbridging: true,
      status: true,
      icekbridging_sirsonline: true,
    },
  });
  const {
    tempatTidurRl,
    dropdown,
    selectedRow,
    selectedRowRl,
    fetchDropdowns,
    setSelectedRow,
    setSelectedRowRl,
  } = useBedStore();

  const defaultFormValues = {
    name: "",
    kelas_id: null,
    kelaskamarsirsonline: null,
    gol_golongankelasaplicares: null,
    ruang_aplicares: null,
    kamar_id: null,
    jenis_layanan_id: null,
    remark: "",
    icekbridging: true,
    status: true,
    icekbridging_sirsonline: true,
  };

  const fields = getBedFields(
    dropdown.kelasKamar,
    dropdown.aplicares,
    dropdown.rsOnline,
    dropdown.ruangAplicares,
    dropdown.kamar,
    tempatTidurRl
  );

  const checkbox = getBedCheckboxes();

  const mappedTempatTidurRl = (data) =>
    data.map((item) => ({
      id: item.value,
      nama: item.label || "-",
    }));

  const formattedTempatTidurRl = mappedTempatTidurRl(tempatTidurRl);

  const onSubmit = async (data) => {
    try {
      if (selectedRow.id) {
        await updateBed({
          ...data,
          id: selectedRow.id,
        });
        reset(defaultFormValues);
        setSelectedRow({});
      } else {
        await postBed(data);
        setSelectedRow({});
        reset();
      }

      toastWithProgress({
        title: "Berhasil",
        description: "Data Bed berhasil disimpan.",
        type: "success",
      });
    } catch (err) {
      console.error("Gagal simpan Bed:", err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal simpan Bed",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (selectedRow?.id) {
      setValue("id", selectedRow.id || "");
      setValue("name", selectedRow.nama || "");
      setValue("kelas_id", selectedRow.kelas_id || "");
      setValue("kelaskamarsirsonline", selectedRow.kelaskamarsirsonline || "");
      setValue(
        "gol_golongankelasaplicares",
        selectedRow.gol_golongankelasaplicares || ""
      );
      setValue("ruang_aplicares", selectedRow.ruang_aplicares || "");
      setValue("kamar_id", selectedRow.kamar_id || "");
      setValue("jenis_layanan_id", selectedRow.jenis_layanan_id || "");
    }

    if (selectedRowRl?.id) {
      setValue("jenis_layanan_id", selectedRowRl.id);
    }
  }, [selectedRow, selectedRowRl]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  return (
    <Card className="p-6 w-full mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div>
            <p className="uppercase text-muted-foreground text-sm font-medium">
              ID Tempat Tidur
            </p>
            <p className="text-xl font-bold">{selectedRow.id || "-"}</p>
          </div>
          <DynamicFormFields
            fields={fields}
            control={control}
            errors={errors}
            checkboxes={checkbox}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Card className="p-4 max-h-[20rem] overflow-auto">
            <p className="font-semibold mb-2">Tempat Tidur</p>
            <Table
              data={formattedTempatTidurRl}
              border="border"
              listIconButton={[
                {
                  name: "input",
                  value: true,
                  icon: <Icon icon="token:get" />,
                  variant: "primary3",
                  onClick: (row) => {
                    setSelectedRowRl(row);
                  },
                },
              ]}
              customWidths={{ nama: "min-w-[56.5rem]" }}
              hiddenColumns={["id"]}
            />
          </Card>
        </div>
      </div>

      <div className="border-b" />

      <div className="flex justify-between">
        <Button
          variant="destructive"
          className="rounded-sm"
          onClick={() => {
            reset({
              name: "",
              kelas_id: null,
              kelaskamarsirsonline: null,
              gol_golongankelasaplicares: null,
              ruang_aplicares: null,
              kamar_id: null,
              jenis_layanan_id: null,
              remark: "",
              icekbridging: true,
              status: true,
              icekbridging_sirsonline: true,
            });
            setSelectedRow({});
            setSelectedRowRl({});
          }}
        >
          Reset
        </Button>
        <Button
          className="bg-primary1 rounded-sm"
          onClick={handleSubmit(onSubmit)}
        >
          Simpan
        </Button>
      </div>
    </Card>
  );
};

export default BedForm;
