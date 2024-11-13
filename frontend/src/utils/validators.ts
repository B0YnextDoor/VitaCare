export const validateDate = (value: Date) => {
  const birthDate = new Date(value);
  const today = new Date();

  // Проверка на будущую дату
  if (birthDate > today) return "Birthday cannot be in the future";

  // Проверка на минимальный возраст (например, 18 лет)
  const minAge = 18;
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - minAge);
  if (birthDate > minDate) return "You must be at least 18 years old";

  // Проверка на максимальный возраст (например, 120 лет)
  const maxAge = 120;
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - maxAge);
  if (birthDate < maxDate) return "Invalid birthday";

  return true;
};

export const validateWorkDay = (start: string, end: string) => {
  const startTime = start.split(":");
  const endTime = end.split(":");
  const startMins = +startTime[0] * 60 + +startTime[1];
  const endMins = +endTime[0] * 60 + +endTime[1];
  const duration = endMins - startMins;
  if (duration / 60 < 6) return "Minimal working day duration - 6 hours!";
};
