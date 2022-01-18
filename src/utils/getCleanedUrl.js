const getCleanedUrl = (url) => (!url.startsWith("http") ? `http://${url}` : url);

export default getCleanedUrl;
