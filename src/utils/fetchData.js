const fetchData = async (url, options, method = "POST") => {
	const response = await fetch(url, {
		method,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(options),
	});

	const data = await response.json();

	return { data };
};

export default fetchData;
