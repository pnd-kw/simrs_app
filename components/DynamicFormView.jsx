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
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";

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

const renderFieldWrapper = (field, children, errorNode, extraRight) => {
  if (field.layout === "horizontal") {
    return (
      <div className="flex flex-col">
        <div className="flex items-start">
          {field.type !== "radio" && (
            <label
              htmlFor={field.name}
              className="w-[150px] text-xs uppercase pt-2"
            >
              {field.label}
            </label>
          )}

          <div
            className={cn(
              "flex-1 flex flex-col relative",
              field.type === "radio" ? "pt-2" : ""
            )}
          >
            {children}
            {errorNode}

            {extraRight && (
              <div className="absolute -top-5 right-0">{extraRight}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col relative">
      <div className="flex items-center justify-between">
        {field.type !== "radio" && (
          <label htmlFor={field.name} className="text-xs uppercase">
            {field.label}
          </label>
        )}
        {extraRight && (
          <div className="absolute right-0 top-0 text-xs text-blue-600">
            {extraRight}
          </div>
        )}
      </div>
      {children}
      {errorNode}
    </div>
  );
};

// ==== Time Picker Field ====
const TimePickerField = ({ field, controllerField, error }) => {
  const [open, setOpen] = useState(false);
  const times = generateTimes(5);

  const timeNode = (
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
  );

  const errorNode = (
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
  );

  return renderFieldWrapper(field, timeNode, errorNode);
};

// ==== Dynamic Form Fields ====
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
        <div key={field.name} className={`${field.colSpan || colSpanDefault}`}>
          <Controller
            control={control}
            name={field.name}
            render={({ field: controllerField }) => {
              const isRequired =
                field.showRequiredNote &&
                (!field.requiredUnless ||
                  String(field.getValues("insurance_id")) !==
                    String(field.requiredUnless));

              const requiredText = field.requiredNoteText || "wajib diisi";

              const errorNode = (
                <div className="h-[16px]">
                  {errors?.[field.name] ? (
                    <span className="text-red-500 text-[10px] italic leading-none">
                      {errors[field.name].message}
                    </span>
                  ) : isRequired ? (
                    <span className="text-red-500 text-[10px] italic uppercase leading-none">
                      {requiredText}
                    </span>
                  ) : null}
                </div>
              );

              switch (field.type) {
                case "input": {
                  const inputNode = (
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
                        <Controller
                          control={control}
                          name="insurance_id"
                          render={({ field: insuranceField }) => {
                            const requireId = field.requireInsuranceId;
                            const canFetch = requireId
                              ? String(insuranceField.value) ===
                                String(requireId)
                              : true;

                            return (
                              <Button
                                type="button"
                                variant="white"
                                size="xs"
                                disabled={!canFetch}
                                className={cn(
                                  "absolute right-1 top-1/2 -translate-y-1/2 rounded-sm",
                                  canFetch
                                    ? `${
                                        field.fetchBg || "bg-primary1"
                                      } cursor-pointer hover:opacity-80`
                                    : "bg-gray-300 cursor-not-allowed"
                                )}
                                onClick={async () => {
                                  if (!canFetch || !field.fetchAction?.api)
                                    return;
                                  try {
                                    const res = await field.fetchAction.api(
                                      controllerField.value
                                    );
                                    const mapped =
                                      field.fetchAction.mapResult(res);
                                    Object.entries(mapped).forEach(
                                      ([key, val]) => {
                                        field.setValue?.(key, val ?? "");
                                      }
                                    );
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                              >
                                <Icon
                                  icon={field.icon || "token:get"}
                                  className="text-white"
                                />
                              </Button>
                            );
                          }}
                        />
                      )}
                    </div>
                  );

                  return renderFieldWrapper(field, inputNode, errorNode);
                }

                case "combobox": {
                  const comboNode = (
                    <ControlledCombobox
                      control={control}
                      name={field.name}
                      options={field.options}
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                      valueKey={field.valueKey || "value"}
                      labelKey={field.labelKey || "label"}
                    />
                  );
                  return renderFieldWrapper(field, comboNode, errorNode);
                }

                case "time":
                  return (
                    <TimePickerField
                      field={field}
                      controllerField={controllerField}
                      error={errors?.[field.name]}
                    />
                  );

                case "date": {
                  const todayBtn = field.showTodayButton ? (
                    <button
                      type="button"
                      className="text-blue-500 text-xs"
                      onClick={() => controllerField.onChange(new Date())}
                    >
                      Today
                    </button>
                  ) : null;

                  const dateNode = (
                    <DatePicker
                      control={control}
                      name={field.name}
                      schedule={field.schedule}
                      disableBeforeToday={field.disableBeforeToday}
                      disabledDays={field.disabledDays}
                      disabledAll={field.disabledAll}
                      requireSchedule={field.requireSchedule}
                      icon={field.icon}
                      placeholder={field.placeholder}
                      mode={field.mode || "single"}
                      closeOnSelect={field.closeOnSelect}
                      numberOfMonths={field.numberOfMonths}
                    />
                  );

                  return renderFieldWrapper(
                    field,
                    dateNode,
                    errorNode,
                    todayBtn
                  );
                }

                case "radio": {
                  const radioNode = (
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
                              className=""
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
                    </div>
                  );
                  return renderFieldWrapper(field, radioNode, errorNode);
                }

                case "inputWithCheckbox": {
                  const isChecked = !!field.getValues?.("is_same_with_ktp");

                  const cbNode = (
                    <div className="flex items-center gap-1">
                      <Checkbox
                        id={`${field.name}-same`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const isTrue = !!checked;
                          field.setValue?.("is_same_with_ktp", isTrue);

                          if (isTrue) {
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
                  );

                  const inputNode = (
                    <Input
                      {...controllerField}
                      placeholder={field.placeholder}
                      disabled={isChecked}
                      className={`text-sm rounded-sm ${
                        errors?.[field.name] ? "border-red-500" : ""
                      }`}
                    />
                  );

                  return renderFieldWrapper(
                    field,
                    inputNode,
                    errorNode,
                    cbNode
                  );
                }
                case "textarea": {
                  const textareaNode = (
                    <Textarea
                      {...controllerField}
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                      rows={field.rows || 3}
                      className={`text-sm rounded-sm resize-none ${
                        errors?.[field.name] ? "border-red-500" : ""
                      }`}
                    />
                  );

                  return renderFieldWrapper(field, textareaNode, errorNode);
                }
                
                case "withPopup": {
                  const popupNode = (
                    <div className="relative">
                      <Input
                        {...controllerField}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        className={`text-sm rounded-sm ${
                          errors?.[field.name] ? "border-red-500" : ""
                        }`}
                      />

                      <Button
                        type="button"
                        variant="white"
                        size="xs"
                        className={cn(
                          `absolute right-1 top-1/2 -translate-y-1/2 rounded-sm ${
                            field.color || "bg-primary1"
                          } cursor-pointer hover:opacity-80`
                        )}
                        onClick={() => {
                          const props = field.withPopup?.getProps
                            ? field.withPopup.getProps(
                                field.getValues?.() || {}
                              )
                            : {};

                          field.open?.({
                            contentTitle: field.withPopup?.title,
                            component: field.withPopup?.component,
                            props: {
                              ...props,
                              onSelect: (val) => {
                                controllerField.onChange(val);
                                field.setValue?.(field.name, val);
                              },
                            },
                          });
                        }}
                      >
                        <Icon
                          icon={field.icon || "mdi:open-in-new"}
                          className="text-white"
                        />
                      </Button>
                    </div>
                  );

                  return renderFieldWrapper(field, popupNode, errorNode);
                }

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
