export const saveData = (blob, fileName) => {
	const a = document.createElement("a");
	const targetElement = document.querySelector(".app");
	const url = window.URL.createObjectURL(blob);

	targetElement.appendChild(a);

	a.setAttribute("id", "screenshot-link-target");
	a.style = "display: none";
	a.href = url;
	a.download = fileName;
	a.click();

	window.URL.revokeObjectURL(url);

	targetElement.removeChild(a);
};
