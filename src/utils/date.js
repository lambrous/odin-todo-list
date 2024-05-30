import { differenceInDays, isThisYear, format, startOfDay } from "date-fns";

export function getRelativeDate(
	targetDate,
	{ onlyDate = false, showOverdue = false } = {},
) {
	const daysDiff = differenceInDays(
		startOfDay(targetDate),
		startOfDay(new Date()),
	);
	let relativeDateDescription;

	if (showOverdue && daysDiff < 0) {
		relativeDateDescription = "Overdue";
	} else if (daysDiff === 0) {
		relativeDateDescription = "Today";
	} else if (daysDiff === 1 && !onlyDate) {
		relativeDateDescription = "Tomorrow";
	} else if (daysDiff > 1 && daysDiff < 15 && !onlyDate) {
		relativeDateDescription = `${daysDiff} days left`;
	} else if (daysDiff === -1 && !onlyDate) {
		relativeDateDescription = "Yesterday";
	} else if (daysDiff < -1 && daysDiff > -15 && !onlyDate) {
		relativeDateDescription = `${Math.abs(daysDiff)} days ago`;
	} else if (isThisYear(targetDate)) {
		relativeDateDescription = format(targetDate, "MMM d");
	} else {
		relativeDateDescription = format(targetDate, "MMM y");
	}

	return { daysDiff, relativeDateDescription };
}
