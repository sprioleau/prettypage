import html2canvas from "html2canvas";
import { shortFormatDate } from "./shortFormatDate";
import { isBrowser, isMobile } from "react-device-detect";
import { saveData } from "./saveData";

const targetSelector = ".screenshot";
const fileName = `pretty-page-screenshot_${shortFormatDate(new Date())}.png`;
const options = { scale: 1.5 };

const browserExport = async (targetSelector, fileName, options) => {
	const canvas = await html2canvas(document.querySelector(targetSelector), options);
	canvas.toBlob((blob) => saveData(blob, fileName));
};

const mobileExport = async () => {
	const canvas = await html2canvas(document.querySelector(targetSelector), options);
	canvas.toBlob((blob) => dispatch(setScreenshotUrl(window.URL.createObjectURL(blob))));
	history.push("/screenshot");
};

const saveScreenshot = () => {
	if (isBrowser) return browserExport(targetSelector, fileName, options);
	if (isMobile) return mobileExport();
};

export default saveScreenshot;
