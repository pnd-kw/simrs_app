import { format } from "date-fns";

export function formatDate(isoString) {
  if (!isoString) return "-";

  try {
    const date = new Date(isoString);
    return format(date, "dd/MM/yyyy HH:mm");
  } catch {
    return "-";
  }
}

export const todayString = format(new Date(), "yyyy-MM-dd");

export const getNamaHari = (day) => {
  const mapHari = {
    monday: "Senin",
    tuesday: "Selasa",
    wednesday: "Rabu",
    thursday: "Kamis",
    friday: "Jumat",
    saturday: "Sabtu",
    sunday: "Minggu",
  };

  return mapHari[day] || day;
};