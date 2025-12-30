import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectComponent({
  data = [],
  placeholder = "Pilih...",
  value,
  onValueChange,
  className = "w-full",
  isLoading,
  disabled = false,
  error,
  valueKey = "code",
  labelKey = "name",
}) {
  
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data.map((item) => (
            <SelectItem key={item.id} value={item[valueKey]}>
              {item[labelKey]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
