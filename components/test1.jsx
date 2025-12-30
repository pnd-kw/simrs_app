import ControlledCombobox from "@/components/ControlledCombobox";
import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import DatePicker from "@/utils/datePicker";
import { todayString } from "@/utils/tanggal/formatDate";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Icon } from "@iconify/react";

// ==== Time Picker Helper ====
const generateTimes = (interval = 5) => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += interval) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }
  return times;
};

const TimePickerField = ({ field, controllerField, error }) => {
  const [open, setOpen] = useState(false);
  const times = generateTimes(5);

  return (
    <>
      <label htmlFor={field.name}>{field.label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`justify-start text-sm rounded-sm ${
              error ? "border-red-500" : ""
            }`}
          >
            {controllerField.value || "Pilih waktu"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[160px]">
          <Command>
            <CommandGroup heading="Time">
              <ScrollArea className="h-[200px]">
                {times.map((time) => (
                  <CommandItem
                    key={time}
                    onSelect={() => {
                      controllerField.onChange(time);
                      setOpen(false);
                    }}
                  >
                    {time}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="h-[16px]">
        {error ? (
          <span className="text-red-500 text-[10px] italic leading-none">
            {error.message}
          </span>
        ) : field.showRequiredNote ? (
          <span className="text-red-500 text-[10px] italic leading-none">
            wajib diisi
          </span>
        ) : null}
      </div>
    </>
  );
};

const DynamicFormFields = ({
  fields = [],
  checkboxes = [],
  control,
  errors,
  gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  colSpanDefault = "col-span-1",
}) => {
  return (
    <div className={`grid ${gridCols} gap-4`}>
      {fields.map((field) => (
        <div
          key={field.name}
          className={`grid gap-1 text-xs uppercase ${
            field.colSpan || colSpanDefault
          }`}
        >
          <Controller
            control={control}
            name={field.name}
            render={({ field: controllerField }) => {
              switch (field.type) {
                case "input":
                  return (
                    <>
                      <label htmlFor={field.name}>{field.label}</label>
                      <div className="relative flex">
                        <Input
                          {...controllerField}
                          placeholder={field.placeholder}
                          disabled={field.disabled}
                          className={`text-sm rounded-sm ${
                            errors?.[field.name] ? "border-red-500" : ""
                          }`}
                        />
                        {field.withFetchButton && (
                          <Button
                            type="button"
                            variant="white"
                            size="xs"
                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary1 rounded-sm cursor-pointer hover:opacity-80"
                            onClick={async () => {
                              if (!field.fetchAction?.api) return;
                              try {
                                const res = await field.fetchAction.api(
                                  controllerField.value
                                );
                                const mapped = field.fetchAction.mapResult(res);

                                Object.entries(mapped).forEach(([key, val]) => {
                                  field.setValue?.(key, val ?? "");
                                });
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          >
                            <Icon icon="token:get" className="text-white" />
                          </Button>
                        )}
                      </div>
                      <div className="h-[16px]">
                        {errors?.[field.name] ? (
                          <span className="text-red-500 text-[10px] italic leading-none">
                            {errors[field.name].message}
                          </span>
                        ) : field.showRequiredNote ? (
                          <span className="text-red-500 text-[10px] italic leading-none">
                            wajib diisi
                          </span>
                        ) : null}
                      </div>
                    </>
                  );

                case "combobox":
                  return (
                    <>
                      <label htmlFor={field.name}>{field.label}</label>
                      <ControlledCombobox
                        control={control}
                        name={field.name}
                        options={field.options}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        error={errors?.[field.name]}
                        valueKey={field.valueKey || "value"}
                        labelKey={field.labelKey || "label"}
                      />
                      <div className="h-[16px]">
                        {errors?.[field.name] ? (
                          <span className="text-red-500 text-[10px] italic leading-none">
                            {errors[field.name].message}
                          </span>
                        ) : field.showRequiredNote ? (
                          <span className="text-red-500 text-[10px] italic leading-none">
                            wajib diisi
                          </span>
                        ) : null}
                      </div>
                    </>
                  );

                case "time":
                  return (
                    <TimePickerField
                      field={field}
                      controllerField={controllerField}
                      error={errors?.[field.name]}
                    />
                  );

                case "date":
                  return (
                    <>
                      <div className="flex justify-between">
                        <label htmlFor={field.name}>{field.label}</label>
                        {field.showTodayButton && (
                          <button
                            type="button"
                            onClick={() =>
                              controllerField.onChange(todayString)
                            }
                            className="text-blue-500 text-xs hover:underline"
                          >
                            Today
                          </button>
                        )}
                      </div>
                      <DatePicker
                        control={control}
                        name={field.name}
                        schedule={field.schedule}
                        disableBeforeToday={field.disableBeforeToday}
                        disabledDays={field.disabledDays}
                        requireSchedule={field.requireSchedule}
                        icon={field.icon}
                        placeholder={field.placeholder}
                        mode={field.mode || "single"}
                        closeOnSelect={field.closeOnSelect}
                        numberOfMonths={field.numberOfMonths}
                      />
                      <div className="h-[15px]"></div>
                    </>
                  );

                case "radio":
                  return (
                    <>
                      <div className="flex">
                        <RadioGroup
                          value={controllerField.value}
                          onValueChange={controllerField.onChange}
                          className="flex gap-6"
                        >
                          {field.options?.map((opt) => (
                            <div
                              key={opt.value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={opt.value}
                                id={`${field.name}-${opt.value}`}
                                className="data-[state=checked]:border-blue-500 data-[state=checked]:text-blue-500 data-[state=checked]:bg-blue-500"
                              />
                              <Label
                                htmlFor={`${field.name}-${opt.value}`}
                                className="text-xs normal-case"
                              >
                                {opt.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <div className="h-[16px]">
                          {errors?.[field.name] ? (
                            <span className="text-red-500 text-[10px] italic leading-none">
                              {errors[field.name].message}
                            </span>
                          ) : field.showRequiredNote ? (
                            <span className="text-red-500 text-[10px] italic leading-none">
                              wajib diisi
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </>
                  );

                case "inputWithCheckbox":
                  const [isChecked, setIsChecked] = useState(false);
                  return (
                    <>
                      <div className="flex items-center gap-2 justify-between">
                        <label htmlFor={field.name}>{field.label}</label>
                        <div className="items-center flex gap-1">
                          <Checkbox
                            id={`${field.name}-same`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              setIsChecked(!!checked);
                              if (checked) {
                                const alamatKtp =
                                  field.getValues?.("address_ktp") || "";
                                field.setValue?.(field.name, alamatKtp);
                              } else {
                                field.setValue?.(field.name, "");
                              }
                            }}
                          />
                          <label
                            htmlFor={`${field.name}-same`}
                            className="text-xs cursor-pointer normal-case"
                          >
                            {field.sameLabel}
                          </label>
                        </div>
                      </div>

                      <Input
                        {...controllerField}
                        placeholder={field.placeholder}
                        disabled={isChecked}
                        className={`text-sm rounded-sm ${
                          errors?.[field.name] ? "border-red-500" : ""
                        }`}
                      />

                      <div className="h-[16px]">
                        {errors?.[field.name] ? (
                          <span className="text-red-500 text-[10px] italic leading-none">
                            {errors[field.name].message}
                          </span>
                        ) : field.showRequiredNote ? (
                          <span className="text-red-500 text-[10px] italic leading-none">
                            wajib diisi
                          </span>
                        ) : null}
                      </div>
                    </>
                  );

                default:
                  return null;
              }
            }}
          />
        </div>
      ))}

      {/* Checkbox Fields */}
      {checkboxes.length > 0 && (
        <div className="col-span-full flex flex-wrap gap-x-6 gap-y-2 items-center text-xs uppercase">
          {checkboxes.map((field) => (
            <Controller
              key={field.name}
              control={control}
              name={field.name}
              render={({ field: controllerField }) => (
                <label className="inline-flex items-center gap-2">
                  <Checkbox
                    id={field.name}
                    disabled={field.disabled}
                    checked={controllerField.value || false}
                    onCheckedChange={controllerField.onChange}
                  />
                  {field.label}
                </label>
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicFormFields;
