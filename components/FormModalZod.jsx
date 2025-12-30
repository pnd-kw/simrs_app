import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Controller } from "react-hook-form";
import ReusableComboboxZod from "./ReusableComboboxZod";

export function FormModalZod({
  open,
  onClose,
  onSubmit,
  title = "Form",
  fields = [],
  checkboxes = [],
  submitLabel = "Simpan",
  register = () => {},
  errors = {},
  control,
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[90vw] lg:max-w-[1100px] p-0 max-h-screen">
        <div className="bg-primary1 text-white px-6 py-4 flex items-center justify-between">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <button onClick={() => onClose(false)} className="text-white text-xl">
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-5 bg-white">
          {fields.map((field) => {
            const error = errors?.[field.name];
            const hasError = !!error;

            return (
              <div key={field.name} className="space-y-1 w-full">
                <Label
                  htmlFor={field.name}
                  className="mx-1 text-xs font-normal uppercase text-stone-900"
                >
                  {field.label}
                </Label>

                {field.type === "input" && (
                  <Input
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    aria-invalid={hasError}
                    disabled={field.disabled}
                    className={`w-full rounded-sm border ${
                      hasError ? "border-red-500" : "border-gray-300"
                    } ${
                      field.disabled ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  />
                )}

                {field.type === "combobox" && (
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: controllerField }) => (
                      <div
                        className={`w-full ${
                          hasError ? "border border-red-500 rounded" : ""
                        }`}
                      >
                        <ReusableComboboxZod
                          value={controllerField.value}
                          onChange={controllerField.onChange}
                          options={field.options}
                          placeholder={field.placeholder}
                          error={errors?.[field.name]}
                        />
                      </div>
                    )}
                  />
                )}

                {hasError && (
                  <p className="mx-1 text-xs font-normal text-red-500">
                    {error.message || "Wajib diisi"}
                  </p>
                )}
              </div>
            );
          })}

          {/* Checklist */}
          <div className="flex flex-wrap gap-8 pt-2">
            {checkboxes.map((cb, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Controller
                  control={control}
                  name={cb.name}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`cb-${cb.name}`}
                        checked={field.value}
                        onCheckedChange={(val) => field.onChange(!!val)}
                      />
                      <Label htmlFor={`cb-${idx}`} className="text-sm">
                        {cb.label}
                      </Label>
                    </div>
                  )}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md"
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
