import DynamicFormFields from "@/components/DynamicFormView";
import { Button } from "@/components/ui/button";
import { useFetchAsuransi } from "@/hooks/fetch/master_data/use-fetch-asuransi";
import { useFetchPerusahaanAsuransi } from "@/hooks/fetch/master_data/use-fetch-perusahaan-asuransi";
import {
  useKecamatanStore,
  useKelurahanStore,
  useKotaStore,
  useNegaraStore,
  useProvinsiStore,
} from "@/stores/management/profile_rekam_medis/useLokasiStore";
import {
  useAgamaStore,
  useGolonganDarahStore,
  useListPendidikanStore,
  usePekerjaanStore,
  usePenanggungJawabStore,
  useProfileRekamMedisStore,
  useSukuBangsaStore,
} from "@/stores/management/profile_rekam_medis/useProfileRekamMedis";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  defaultFormValuesProfileRekamMedis,
  getAlamatFields,
  getAsuransiFields,
  getDataPasienFields,
  getMediaSosialFields,
  getPenanggungJawabFields,
  getProfileRekamMedisCheckboxes,
  getProfileRekamMedisFields,
  profileRekamMedisSchema,
} from "./ProfileRekamMedisFields";

const ProfileRekamMedisForm = () => {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    control,
  } = useForm({
    resolver: zodResolver(profileRekamMedisSchema),
    defaultValues: defaultFormValuesProfileRekamMedis,
  });

  const negaraId = useWatch({ control, name: "country" });
  const provinsiId = useWatch({ control, name: "province" });
  const kotaId = useWatch({ control, name: "city" });
  const kecamatanId = useWatch({ control, name: "district" });

  const { agama, fetchAgama } = useAgamaStore();
  const { golonganDarah, fetchGolonganDarah } = useGolonganDarahStore();
  const { sukuBangsa, fetchSukuBangsa } = useSukuBangsaStore();
  const { listPendidikan, fetchListPendidikan } = useListPendidikanStore();
  const { pekerjaan, fetchPekerjaan } = usePekerjaanStore();
  const { penanggungJawab, fetchPenanggungJawab } = usePenanggungJawabStore();
  const { negara, fetchNegara } = useNegaraStore();
  const { provinsi, fetchProvinsi } = useProvinsiStore();
  const { kota, fetchKota } = useKotaStore();
  const { kecamatan, fetchKecamatan } = useKecamatanStore();
  const { kelurahan, fetchKelurahan } = useKelurahanStore();
  const { data: asuransi } = useFetchAsuransi();
  const { data: perusahaanAsuransi } = useFetchPerusahaanAsuransi();

  const fields = getProfileRekamMedisFields(setValue);
  const dataPasienField = getDataPasienFields(
    agama,
    golonganDarah,
    sukuBangsa,
    pekerjaan,
    listPendidikan
  );
  const alamatField = getAlamatFields(
    negara,
    provinsi,
    kota,
    kecamatan,
    kelurahan,
    setValue,
    getValues
  );
  const penanggungJawabFields = getPenanggungJawabFields(penanggungJawab);
  const asuransiFields = getAsuransiFields(
    asuransi,
    perusahaanAsuransi,
    setValue,
    getValues
  );
  const socialMediaFields = getMediaSosialFields();
  const checkbox = getProfileRekamMedisCheckboxes();
  const {
    selectedRow,
    setSelectedRow,
    addProfileRekamMedis,
    updateProfileRekamMedis,
  } = useProfileRekamMedisStore();

  const onSubmit = async (data) => {
    try {
      if (selectedRow?.id) {
        await updateProfileRekamMedis({ ...data, id: selectedRow.id });
      } else {
        await addProfileRekamMedis(data);
        setSelectedRow(defaultFormValuesProfileRekamMedis);
      }
      setSelectedRow({});
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedRow?.id) {
      Object.keys(defaultFormValuesProfileRekamMedis).forEach((key) => {
        let value = selectedRow[key];

        if (!value) {
          value = defaultFormValuesProfileRekamMedis[key];
        } else {
          if (typeof value === "object" && "id" in value) {
            value = value.id;
          } else if (typeof value === "object" && "code" in value) {
            value = value.code;
          } else if (
            ["date_ob", "first_visit"].includes(key) &&
            typeof value === "string"
          ) {
            value = new Date(value);
          }
        }

        setValue(key, value);
      });

      setValue("id", selectedRow.id || "");
    }
  }, [selectedRow, setValue]);

  useEffect(() => {
    fetchNegara();
    fetchAgama();
    fetchGolonganDarah();
    fetchSukuBangsa();
    fetchPekerjaan();
    fetchListPendidikan();
    fetchPenanggungJawab();
  }, [
    fetchNegara,
    fetchAgama,
    fetchGolonganDarah,
    fetchSukuBangsa,
    fetchPekerjaan,
    fetchListPendidikan,
    fetchPenanggungJawab,
  ]);

  useEffect(() => {
    const prefillLocation = async () => {
      if (!selectedRow) return;

      if (selectedRow.country) {
        setValue("country", selectedRow.country.code);
        await fetchProvinsi(selectedRow.country.code);
      }

      if (selectedRow.province) {
        setValue("province", selectedRow.province.code);
        await fetchKota(selectedRow.province.code);
      }

      if (selectedRow.city) {
        setValue("city", selectedRow.city.code);
        await fetchKecamatan(selectedRow.city.code);
      }

      if (selectedRow.district) {
        setValue("district", selectedRow.district.code);
        await fetchKelurahan(selectedRow.district.code);
      }

      if (selectedRow.sub_district) {
        setValue("sub_district", selectedRow.sub_district.code);
      }
    };

    prefillLocation();
  }, [selectedRow, setValue]);

  useEffect(() => {
    if (negaraId) {
      fetchProvinsi(negaraId);
      setValue("province", "");
      setValue("city", "");
      setValue("district", "");
      setValue("sub_district", "");
    }
  }, [negaraId]);

  useEffect(() => {
    if (provinsiId) {
      fetchKota(provinsiId);
      setValue("city", "");
      setValue("district", "");
      setValue("sub_district", "");
    }
  }, [provinsiId]);

  useEffect(() => {
    if (kotaId) {
      fetchKecamatan(kotaId);
      setValue("district", "");
      setValue("sub_district", "");
    }
  }, [kotaId]);

  useEffect(() => {
    if (kecamatanId) {
      fetchKelurahan(kecamatanId);
      setValue("sub_district", "");
    }
  }, [kecamatanId]);

  return (
    <>
      <div className="gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-3">
            <div>
              <p className="text-2xl">ID Rekam Medis</p>
              <p className="text-3xl mt-3">{selectedRow?.id || "-"}</p>
            </div>
            <div>
              <div className="uppercase text-xl font-bold relative w-full flex items-center gap-2">
                <Image
                  src="/assets/satu-sehat.png"
                  alt="satusehat logo"
                  width={35}
                  height={35}
                />
                <span>Satusehat</span>
              </div>

              <p className="text-3xl mt-3">{selectedRow?.id || "-"}</p>
            </div>
          </div>
          <div
            className={`flex flex-col w-full min-h-[16vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm`}
          >
            <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
              id pasien
            </div>
            <div className="p-4">
              <DynamicFormFields
                fields={fields}
                control={control}
                errors={errors}
                gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
              />
            </div>
          </div>
        </div>
        <div className="my-4">
          <div
            className={`flex flex-col w-full min-h-[10vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm`}
          >
            <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
              data pasien
            </div>
            <div className="p-4">
              <DynamicFormFields
                fields={dataPasienField}
                control={control}
                errors={errors}
                gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
              />
            </div>
          </div>
        </div>
        <div className="my-4">
          <div
            className={`flex flex-col w-full min-h-[16vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm`}
          >
            <div className="mb-4 flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
              alamat
            </div>
            <div className="p-4">
              <DynamicFormFields
                fields={alamatField}
                control={control}
                errors={errors}
                gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
              />
            </div>
          </div>
        </div>
        <div className="my-4">
          <div
            className={`flex flex-col w-full min-h-[10vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm`}
          >
            <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
              asuransi
            </div>
            <div className="p-4">
              <DynamicFormFields
                fields={asuransiFields}
                control={control}
                errors={errors}
                gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              />
            </div>
          </div>
        </div>
        <div className="my-4">
          <div
            className={`flex flex-col w-full min-h-[10vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm`}
          >
            <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
              penanggung
            </div>
            <div className="p-4">
              <DynamicFormFields
                fields={penanggungJawabFields}
                control={control}
                errors={errors}
                gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              />
            </div>
          </div>
        </div>
        <div className="my-4">
          <div
            className={`flex flex-col w-full min-h-[10vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm`}
          >
            <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
              media sosial
            </div>
            <div className="p-4">
              <DynamicFormFields
                fields={socialMediaFields}
                control={control}
                errors={errors}
                gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
              />
            </div>
          </div>
          <div className="mt-4">
            <DynamicFormFields
              control={control}
              errors={errors}
              checkboxes={checkbox}
              gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-2">
        <Button
          variant="destructive"
          className="rounded-sm"
          onClick={() => {
            setSelectedRow({});
            reset(defaultFormValuesProfileRekamMedis);
          }}
        >
          <Icon icon="fluent:arrow-sync-12-filled" />
          Reset
        </Button>
        <Button
          className="bg-primary1 rounded-sm"
          onClick={handleSubmit(onSubmit)}
        >
          <Icon icon="material-symbols:save-outline" className="text-white" />
          Simpan
        </Button>
      </div>
    </>
  );
};

export default ProfileRekamMedisForm;
