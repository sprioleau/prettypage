const getTimeStamp = () => {
	const [date, time] = new Date()
		.toLocaleString()
		.split(",")
		.map((item) => item.trim());

	const dateString = date.replaceAll("/", "-");
	const timeString = time.replaceAll(":", ".").replaceAll(" ", "");

	return `${dateString}_${timeString}`;
};

export default getTimeStamp;
