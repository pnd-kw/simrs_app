import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Icon } from "@iconify/react";

export default function ReusableComboboxZod({
  options = [],
  value,
  onChange,
  placeholder = "Pilih",
  error,
  valueKey = "value",
  labelKey = "label",
  disabled = false,
}) {
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const ignoreFocus = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      ignoreFocus.current = false;
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const normalizedOptions = useMemo(() => {
    return options.map((item) => {
      if ("value" in item && "label" in item) return item;
      if ("id" in item && "name" in item)
        return { value: item.id, label: item.name };
      return item;
    });
  }, [options]);

  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? normalizedOptions
      : normalizedOptions.filter((item) =>
          item.label?.toLowerCase().includes(query.toLowerCase())
        );

  // helper to show label for current value
  const displayValue = (val) =>
    normalizedOptions.find((o) => o.value === val)?.label ?? "";

  // try to open combobox in a way headless UI recognizes
  const openOnFocus = (open) => {
    if (open) return; // sudah terbuka
    // 1) coba dispatch ArrowDown ke input (recommended)
    try {
      const ev = new KeyboardEvent("keydown", {
        key: "ArrowDown",
        keyCode: 40,
        which: 40,
        bubbles: true,
      });
      inputRef.current?.dispatchEvent(ev);
      return;
    } catch (err) {
      // fallback: klik tombol panah
      buttonRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <Combobox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className="relative">
            <div
              className={`relative w-full rounded-md border ${
                error ? "border-red-500" : "border-gray-400"
              } ${
                disabled
                  ? "bg-gray-100 cursor-not-allowed opacity-70"
                  : "bg-white"
              } `}
            >
              <Combobox.Input
                ref={inputRef}
                disabled={disabled}
                className="w-full rounded-sm h-[31px] p-2 text-xs leading-5 text-gray-900 shadow-none"
                displayValue={displayValue}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  if (!ignoreFocus.current && !disabled) {
                    openOnFocus(open);
                  }
                }}
                placeholder={placeholder}
              />

              {!disabled && value && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-5 flex items-center px-2 text-gray-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                  }}
                >
                  <Icon icon="uil:times" fontSize={20} />
                </button>
              )}

              <Combobox.Button
                ref={buttonRef}
                disabled={disabled}
                className="absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400 hover:text-primary1" />
              </Combobox.Button>
            </div>

            <Transition
              as={Fragment}
              show={open}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg focus:outline-none border">
                {filteredOptions.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none px-4 py-2 text-gray-500">
                    Tidak ditemukan.
                  </div>
                ) : (
                  filteredOptions.map((item, index) => (
                    <Combobox.Option
                      key={item.value ?? index}
                      className={({ active, selected }) =>
                        `relative cursor-pointer select-none py-2 pl-4 pr-4
    ${
      selected
        ? "bg-green-600 text-white"
        : active
        ? "bg-green-100 text-green-900"
        : "text-gray-900"
    }`
                      }
                      value={item.value}
                    >
                      {item.label}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        )}
      </Combobox>
    </div>
  );
}
