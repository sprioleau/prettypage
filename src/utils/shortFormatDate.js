export const shortFormatDate = (date) => {
	const current_date = date.getDate();
	const current_month = date.getMonth() + 1; //months are zero basedate
	const current_year = date.getFullYear();
	const current_hour = date.getHours();
	const current_minute = date.getMinutes();
	const current_second = date.getSeconds();

	return `${current_date}.${current_month}.${current_year}-${current_hour}.${current_minute}.${current_second}`;
};
