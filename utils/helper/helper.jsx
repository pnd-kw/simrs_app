export const resetLocation = (level, setValue) => {
  if (level === "country") {
    setValue("province", "");
    setValue("city", "");
    setValue("district", "");
    setValue("sub_district", "");
  } else if (level === "province") {
    setValue("city", "");
    setValue("district", "");
    setValue("sub_district", "");
  } else if (level === "city") {
    setValue("district", "");
    setValue("sub_district", "");
  } else if (level === "district") {
    setValue("sub_district", "");
  }
};
