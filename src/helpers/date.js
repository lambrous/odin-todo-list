import { differenceInDays, isThisYear, format } from "date-fns";

export function getRelativeDate(dateToCompare) {
	const today = new Date().toDateString();
	const targetDate = new Date(dateToCompare).toDateString();
	const daysDiff = differenceInDays(targetDate, today);
	let relativeDateDescription;

	if (daysDiff === 0) {
		relativeDateDescription = "Today";
	} else if (daysDiff === 1) {
		relativeDateDescription = "Tomorrow";
	} else if (daysDiff > 1 && daysDiff < 15) {
		relativeDateDescription = `${daysDiff} days left`;
	} else if (daysDiff === -1) {
		relativeDateDescription = "Yesterday";
	} else if (daysDiff < -1 && daysDiff > -15) {
		relativeDateDescription = `${Math.abs(daysDiff)} days ago`;
	} else if (isThisYear(dateToCompare)) {
		relativeDateDescription = format(dateToCompare, "MMM d");
	} else {
		relativeDateDescription = format(dateToCompare, "MMM y");
	}

	return { daysDiff, relativeDateDescription };
}
