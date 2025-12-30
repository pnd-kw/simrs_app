import { Controller } from "react-hook-form";
import ReusableComboboxZod from "@/components/ReusableComboboxZod";

const ControlledCombobox = ({
  control,
  name,
  options,
  placeholder = "Pilih opsi",
  error,
  hasError = false,
  valueKey = "value",
  labelKey = "label",
  disabled = false,
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <div className="w-full">
        <ReusableComboboxZod
          value={field.value}
          onChange={field.onChange}
          options={options}
          placeholder={placeholder}
          error={!!fieldState.error}
          valueKey={valueKey}
          labelKey={labelKey}
          disabled={disabled} 
        />
        {error?.message && (
          <p className="mt-1 text-xs text-red-500">{error?.message}</p>
        )}
      </div>
    )}
  />
);

export default ControlledCombobox;
