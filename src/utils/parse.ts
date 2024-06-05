export function reformatDate(dateString: string): string {
  // split into date and time parts
  const [datePart, timePart] = dateString.split(" ");

  // replace colons with hyphens
  const formattedDate = datePart.replace(/:/g, "-");

  return formattedDate;
}

export function reformatTime(dateString: string): number {
  // split into date and time parts
  const [datePart, timePart] = dateString.split(" ");

  // round time to nearest hour
  const [hours, minutes] = timePart.split(":").map(Number);

  // Round based on minutes: 30+ minutes rounds up, otherwise rounds down
  const formattedTime = minutes >= 30 ? hours + 1 : hours;

  return formattedTime;
}
