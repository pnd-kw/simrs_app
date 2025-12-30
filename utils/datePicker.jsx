import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { id } from "date-fns/locale";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { addDays, format, setHours, setMinutes, subDays } from "date-fns";
import { SkeletonControllerFieldValue } from "./skeletonLoader";

const dayIndex = {
  senin: 1,
  selasa: 2,
  rabu: 3,
  kamis: 4,
  jumat: 5,
  sabtu: 6,
  minggu: 0,
};

// Helper format tampilan range
const formatRange = (range) => {
  const { from, to } = range || {};
  if (from && to)
    return `${format(from, "P", {
      locale: id,
    })}${"  "}s/d${"  "}${format(to, "P", { locale: id })}`;
  if (from) return format(from, "P", { locale: id });
  return "";
};

// Helper untuk memecah range jadi body API
export const toFromToBody = (range) => ({
  from: range?.from ? format(range.from, "yyyy-MM-dd") : null,
  to: range?.to ? format(range.to, "yyyy-MM-dd") : null,
});

const DatePicker = ({
  control,
  name,
  schedule,
  disableBeforeToday = false,
  disabledDays = [],
  requireSchedule = false,
  icon = "bxs:calendar",
  placeholder = "Pilih tanggal",
  /** mode: "single | "range" */
  mode = "single",
  /** Tutup popover saat pilih? - single: default true -range: default akan ditutup ketika from & to sudah terisi */
  closeOnSelect = true,
  /** Berapa bulan yang ingin ditampilkan (opsional untuk mode range) */
  numberOfMonths = mode === "range" ? 2 : 1,
  triggerByIcon = false,
  showTime = false,
  disabledAll = false,
  isLoading = false,
  withoutDate = false,
  showError = true,
  minDays,
  maxDays,
  className,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState }) => {
        const [open, setOpen] = useState(false);
        const [time, setTime] = useState("00:00");

        const years = [];
        for (let y = new Date().getFullYear(); y >= 1925; y--) {
          years.push(y);
        }

        const allowedIndices = schedule
          ? [dayIndex[schedule.toLowerCase()]]
          : null;

        const today = new Date();
        const minDate = minDays ? subDays(today, minDays) : null;
        const maxDate = maxDays ? addDays(today, maxDays) : null;

        const disabled = (date) => {
          const day = date.getDay();
          const today = new Date();
          const isBeforeToday = date < new Date(today.setHours(0, 0, 0, 0));

          if (!disableBeforeToday && minDate && date < minDate) return true;
          if (disableBeforeToday && isBeforeToday) return true;
          if (maxDate && date > maxDate) return true;

          if (requireSchedule && !schedule) return true;
          if (schedule && isBeforeToday) return true;
          if (allowedIndices && !allowedIndices.includes(day)) return true;
          if (disabledDays.includes(day)) return true;

          return false;
        };

        const handleMonthSelect = (month, year) => {
          const date = new Date(year, month, 1);
          onChange(date);
          setOpen(false);
        };

        const displayValue =
          mode === "single"
            ? value
              ? format(value, showTime ? "Pp" : withoutDate ? "MM/yyyy" : "P", {
                  locale: id,
                })
              : ""
            : formatRange(value);

        const handleSelect = (v) => {
          if (disabledAll) return;
          let finalDate = v;
          if (showTime && mode === "single" && v instanceof Date) {
            const [hour, minute] = time.split(":");
            finalDate = setHours(setMinutes(v, minute), hour);
          }

          onChange(finalDate);
          if (mode === "single") {
            // langsung tutup
            if (closeOnSelect && !showTime) setOpen(false);
          } else {
            // range -> tutup kalau from & to sudah ada
            if (v?.from && v?.to) setOpen(false);
          }
        };

        const handleTimeChange = (e) => {
          if (disabledAll) return;
          const newTime = e.target.value;
          setTime(newTime);

          if (value instanceof Date) {
            const [hour, minute] = newTime.split(":");
            const updated = setHours(setMinutes(value, minute), hour);
            onChange(updated);
          }
        };

        return (
          <div className="w-full">
            <Popover open={!disabledAll && open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                {triggerByIcon ? (
                  <div className="relative w-full">
                    <Input
                      readOnly
                      disabled={disabledAll}
                      onClick={() => !disabledAll && setOpen(true)}
                      value={displayValue}
                      placeholder={placeholder}
                      className={`pr-10 cursor-pointer rounded-sm ${
                        className ?? ""
                      }`}
                    />
                    {isLoading && <SkeletonControllerFieldValue />}
                    <Button
                      type="button"
                      variant="transparent"
                      size="xs"
                      disabled={disabledAll}
                      onClick={() => !disabledAll && setOpen((prev) => !prev)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 px-2 h-full rounded-sm"
                    >
                      <Icon icon={icon} className="text-stone-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative w-full">
                    <Input
                      readOnly
                      disabled={disabledAll}
                      onClick={() => !disabledAll && setOpen(true)}
                      value={displayValue}
                      placeholder={placeholder}
                      className="pr-10 cursor-pointer rounded-sm"
                    />
                  </div>
                )}
              </PopoverTrigger>
              {!disabledAll && (
                <PopoverContent align="end" className="w-auto p-0">
                  {withoutDate ? (
                    <div className="flex flex-col p-2">
                      <div className="flex justify-center pb-2">
                        <select
                          className="border rounded-sm pz-2 py-1 text-sm"
                          value={
                            value
                              ? value.getFullYear()
                              : new Date().getFullYear()
                          }
                          onChange={(e) => {
                            const newYear = parseInt(e.target.value, 10);
                            const month = value ? value.getMonth() : 0;
                            onChange(new Date(newYear, month, 1));
                          }}
                        >
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <Button
                            key={i}
                            type="button"
                            variant={
                              value && value.getMonth() === i
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              handleMonthSelect(
                                i,
                                value?.getFullYear() || new Date().getFullYear()
                              )
                            }
                          >
                            {format(new Date(2000, i, 1), "MMM", {
                              locale: id,
                            })}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <Calendar
                        mode={mode}
                        numberOfMonths={numberOfMonths}
                        selected={value}
                        onSelect={handleSelect}
                        disabled={disabled}
                        initialFocus
                        locale={id}
                        captionLayout="dropdown"
                        fromYear={1925}
                        toYear={new Date().getFullYear()}
                      />
                      {showTime && mode === "single" && (
                        <div className="w-full mb-2 flex items-center justify-center gap-2">
                          <input
                            id="time-picker"
                            type="time"
                            value={time}
                            onChange={handleTimeChange}
                            disabled={disabledAll}
                            className="border text-sm rounded-sm px-2 py-1"
                          />
                        </div>
                      )}
                    </>
                  )}
                </PopoverContent>
              )}
            </Popover>
            {showError && fieldState.error && (
              <p className="text-xs text-red-500 mt-1">
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

export default DatePicker;
