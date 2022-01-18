const { chromium } = require("playwright");
const chromiumLambda = require("chrome-aws-lambda");
const sharp = require("sharp");

const defaultOptions = {
	url: "https://web.dev",
	resolution: {
		width: 1280,
		height: 720,
	},
	colorMode: "light",
	color: { rgb: { r: 123, g: 220, b: 181 } },
};

const browserConfig = {
	paddingX: 150,
	paddingY: 120,
	toolbarHeight: 50,
};

const getCleanedUrl = (url) => (!url.startsWith("http") ? `http://${url}` : url);

exports.handler = async function (event, context) {
	const { url, resolution, color, mode } = JSON.parse(event.body);

	const browser = await chromium.launch({
		// const browser = await puppeteer.launch({
		executablePath: process.env.CHROME_EXECUTABLE_PATH || (await chromiumLambda.executablePath),
		args: [
			...chromiumLambda.args,
			"--disable-gpu",
			"--disable-dev-shm-usage",
			"--disable-setuid-sandbox",
			"--no-first-run",
			"--no-sandbox",
			"--no-zygote",
			"--single-process",
		],
		headless: true,
		defaultViewport: {
			width: resolution.width || defaultOptions.resolution.width,
			height: resolution.height || defaultOptions.resolution.height,
		},
	});

	const page = await browser.newPage();

	await page.goto(
		getCleanedUrl(url)
		// { waitUntil: "networkidle" }
	);
	// await page.goto(getCleanedUrl(url), { waitUntil: "networkidle2" });
	// await page.waitForTimeout(2000);

	const screenshot = await page.screenshot({ type: "png" });

	let image = sharp(`src/images/assets/${resolution.value}_${mode}.png`).composite([
		{
			input: screenshot,
			top: browserConfig.paddingY + browserConfig.toolbarHeight,
			left: browserConfig.paddingX,
		},
	]);

	if (color) {
		const { r, g, b } = color;
		image.flatten({ background: { r, g, b } });
	}

	const buffer = await image.toBuffer();
	const base64String = buffer.toString("base64");

	await browser.close();

	return {
		statusCode: 200,
		body: JSON.stringify({ base64String }),
	};
};

// export { handler };
