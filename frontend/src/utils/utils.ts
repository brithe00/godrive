export const convertTo24HourFormat = (time12h: string): string => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = (parseInt(hours, 10) + 12).toString();
  }

  return `${hours}:${minutes}`;
};

export const calculateEndTime = (
  startTime: string,
  estimatedDuration: number
): string => {
  // Convert start time to a 24-hour format
  const startTime24 = convertTo24HourFormat(startTime);

  // Create a Date object for the start time
  const [hours, minutes] = startTime24.split(":");
  const startDate = new Date();
  startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

  // Calculate the end time by adding the estimated duration in minutes
  const endDate = new Date(startDate.getTime() + estimatedDuration * 60 * 1000);

  // Convert end time to 12-hour format
  let endHours = endDate.getHours();
  const endMinutes = endDate.getMinutes();
  const modifier = endHours >= 12 ? "PM" : "AM";

  endHours = endHours % 12;
  endHours = endHours ? endHours : 12; // the hour '0' should be '12'

  const endMinutesStr =
    endMinutes < 10 ? `0${endMinutes}` : endMinutes.toString();
  const endHoursStr = endHours < 10 ? `0${endHours}` : endHours.toString();

  return `${endHoursStr}:${endMinutesStr}`;
};

// Example usage:
//const startTime = "09:00 AM";
//const estimatedDuration = 120; // in minutes
//const endTime = calculateEndTime(startTime, estimatedDuration);
//console.log(`Estimated end time: ${endTime}`);

export const formatDuration = (estimatedDuration: number): string => {
  const hours = Math.floor(estimatedDuration / 60);
  const minutes = estimatedDuration % 60;

  const hoursStr = hours > 0 ? `${hours}h` : "";
  const minutesStr = minutes > 0 ? `${minutes}` : "";

  return `${hoursStr}${minutesStr}`;
};

// Example usage:
//const estimatedDuration = 120; // in minutes
//const formattedDuration = formatDuration(estimatedDuration);
//console.log(`Formatted duration: ${formattedDuration}`); // Output: "2h00m"
