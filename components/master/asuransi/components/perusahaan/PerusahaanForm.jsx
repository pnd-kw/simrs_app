import { postPerusahaan, updatePerusahaan } from "@/api_disabled/master/asuransi";
import DynamicFormFields from "@/components/DynamicFormView";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useBankStore,
  usePerusahaanStore,
} from "@/stores/master/useMasterStore";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getKontakPersonFields,
  getPerusahaanFields,
  getVaFields,
  perusahaanSchema,
} from "./PerusahaanFields";
import { useCreate } from "@/hooks/mutation/use-create";

const PerusahaanForm = () => {
  const { bank, fetchBank } = useBankStore();
  const { selectedRow, setSelectedRow } = usePerusahaanStore();

  const defaultFormValues = {
    name: "",
    phone: "",
    business: "",
    address: "",
    no_virtual_account: "",
    nama_virtual_account: "",
    contactperson: "",
    cpphone: "",
    cpmobilephone: "",
    cpemail: "",
    cpaddress: "",
    nama_bank: undefined,
    status: true,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(perusahaanSchema),
    defaultValues: defaultFormValues,
  });

  const optionsBank = bank.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const fields = getPerusahaanFields();
  const vaField = getVaFields(optionsBank);
  const kontakPersonField = getKontakPersonFields();

  const { mutate } = useCreate({
    apiFn: postPerusahaan,
    queryKey: "perusahaan asuransi",
    successMessage: "Berhasil membuat asuransi.",
    errorMessage: "Gagal membuat asuransi.",
  });

  const onSubmit = async (data) => {
    try {
      if (selectedRow.id) {
        await updatePerusahaan({
          ...data,
          id: selectedRow.id,
        });
        toastWithProgress({
          title: "Sukses",
          description: "Berhasil update asuransi",
          type: "success",
        });
      } else {
        mutate(data, {
          onSuccess: () => {
            fetchData();
            reset();
            setOpenModal(false);
            setSelectedRow({});
          },
        });
      }
    } catch (err) {
      console.error("Gagal simpan loket:", err);
    }
  };

  useEffect(() => {
    if (selectedRow?.id) {
      reset({
        name: selectedRow.nama_perusahaan,
        phone: selectedRow.no_telepon,
        business: selectedRow.business,
        address: selectedRow.alamat,
        no_virtual_account: selectedRow.no_virtual_account,
        nama_virtual_account: selectedRow.nama_virtual_account,
        contactperson: selectedRow.nama_kp,
        cpphone: selectedRow.no_telepon_kp,
        cpmobilephone: selectedRow.no_telepon_kp,
        cpemail: selectedRow.cpemail || "-",
        cpaddress: selectedRow.cpaddress || "-",
      });
    }
  }, [selectedRow]);

  useEffect(() => {
    fetchBank();
  }, []);

  return (
    <Card className="p-6 w-full mx-auto space-y-6">
      <div className="gap-6">
        <div className="space-y-4">
          <div>
            <p className="uppercase text-muted-foreground text-sm font-medium">
              ID Asuransi
            </p>
            <p className="text-xl font-bold">{selectedRow.id || "-"}</p>
          </div>
          <DynamicFormFields
            fields={fields}
            control={control}
            errors={errors}
          />
        </div>
        <div className="my-4">
          <div>
            <p className="font-bold mb-2">Virtual Account Transfer (VA)</p>
            <DynamicFormFields
              fields={vaField}
              control={control}
              errors={errors}
            />
          </div>
        </div>
        <div className="my-4">
          <div>
            <p className="font-bold mb-2">Kontak Person (KP)</p>
            <DynamicFormFields
              fields={kontakPersonField}
              control={control}
              errors={errors}
            />
          </div>
        </div>
      </div>

      <div className="border-b" />

      <div className="flex justify-between">
        <Button
          variant="destructive"
          className="rounded-sm"
          onClick={() => {
            setSelectedRow({});
            reset(defaultFormValues);
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

export default PerusahaanForm;
