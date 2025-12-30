import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getDisplayFields,
  getDisplayTextArea,
  managementDisplaySchema,
} from "./DisplayFields";
import DynamicFormFields from "@/components/DynamicFormView";
import {
  useMovieListStore,
  useTextDisplayListStore,
} from "@/stores/master/useMasterStore";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useManagementDisplayStore } from "@/stores/management/antrian_display/display";
import { zodResolver } from "@hookform/resolvers/zod";

const DisplayForm = () => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm({
    resolver: zodResolver(managementDisplaySchema),

    defaultValues: {
      id: "",
      jenis_id: null,
      text_id: null,
      video_id: null,
      name: "",
      remark: "",
      status: true,
    },
  });
  const {
    selectedRow,
    updateManagementDisplay,
    addManagementDisplay,
    setSelectedRow,
  } = useManagementDisplayStore();
  const { fetchTextDisplayList, textDisplayList } = useTextDisplayListStore();
  const { fetchMovieList, movieList } = useMovieListStore();
  const isEdit = !!selectedRow?.id;
  const fields = getDisplayFields(textDisplayList, movieList, isEdit);
  const textArea = getDisplayTextArea();

  const onSubmit = async (data) => {
    try {
      if (selectedRow?.id) {
        await updateManagementDisplay({ ...data, id: selectedRow.id });
      } else {
        await addManagementDisplay(data);
      }
      setSelectedRow({});
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedRow) {
      setValue("id", selectedRow?.id || "");
      setValue("jenis_id", selectedRow?.jenis_id?.id || "");
      setValue("text_id", selectedRow?.text_id?.id || "");
      setValue("video_id", selectedRow?.video_id?.id || "");
      setValue("name", selectedRow?.name || "");
      setValue("tipe_tampilan", selectedRow?.tipe_tampilan || "");
      setValue("remark", selectedRow?.remark || "");
      setValue("status", selectedRow?.status || "");
    }
  }, [selectedRow]);

  useEffect(() => {
    fetchTextDisplayList();
    fetchMovieList();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <DynamicFormFields
            fields={fields}
            control={control}
            errors={errors}
            gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-2"
          />
        </div>
        <div>
          <DynamicFormFields
            fields={textArea}
            control={control}
            errors={errors}
            gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-2"
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-2">
        <Button
          variant="destructive"
          className="rounded-sm"
          onClick={() => {
            setSelectedRow({});
            reset();
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

export default DisplayForm;
