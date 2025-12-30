import { format } from "date-fns";

export const buildQueryString = (data) => {
  const payload = Object.fromEntries(
    Object.entries(data).flatMap(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        value === "all"
      )
        return [];

      if (key === "tanggal_range" && (value?.from || value?.to)) {
        const fromDate = value?.from ? format(value.from, "yyyy-MM-dd") : "";
        const toDate = value?.to ? format(value.to, "yyyy-MM-dd") : "";
        return [
          ["tanggal_mulai", fromDate],
          ["tanggal_selesai", toDate],
        ];
      }

      if (key === "search_text" || key === "search_column") {
        if (Array.isArray(value)) {
          return value.map((v) => [`${key}[]`, v]);
        }

        return [[`${key}[]`, value]];
      }

      if (value === "true" || value === "false")
        return [[key, value === "true"]];
      return [[key, value]];
    })
  );

  return Object.entries(payload)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value).replace(
          /%20/g,
          " "
        )}`
    )
    .join("&");
};
