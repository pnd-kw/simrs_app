import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
} from "date-fns";

const ageCalculator = (birthDateString) => {
  if (!birthDateString) return "Invalid date";

  const birthDate = new Date(birthDateString);
  const now = new Date();

  const years = differenceInYears(now, birthDate);
  const months = differenceInMonths(now, birthDate) % 12;
  const days = differenceInDays(now, birthDate) % 30;

  return `${years} th ${months} bl ${days} hr`;
};

export default ageCalculator;
