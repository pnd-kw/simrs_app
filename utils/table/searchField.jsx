import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";

const SearchField = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <Icon
        icon="mingcute:search-line"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
      />
      <Input
        placeholder="Cari"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 rounded-sm"
      />
    </div>
  );
};

export default SearchField;
