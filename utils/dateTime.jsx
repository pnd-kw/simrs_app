import { format, parseISO } from "date-fns";

export function Date(date = "") {
    if (!date) return "Invalid date";
    const parsedDate = parseISO(date);
    if (isNaN(parsedDate.getTime())) return "Invalid date";
    return format(parsedDate, "dd/MM/yyyy");
}

export function DateTime(date = "") {
    if (!date) return "Invalid date";
    const parsedDate = parseISO(date);
    if (isNaN(parsedDate.getTime())) return "Invalid date";
    return format(parsedDate, "dd/MM/yyyy HH:mm");
}