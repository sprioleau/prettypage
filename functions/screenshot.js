import { browserConfig, defaultOptions } from "../src/constants";

import chromium from "chrome-aws-lambda";
import { getCleanedUrl } from "../src/utils";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const handler = async function (event, context) {
	const { url, resolution, color, mode } = JSON.parse(event.body);

	const browser = await puppeteer.launch({
		executablePath: process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
		args: [
			...chromium.args,
			// "--disable-gpu",
			// "--disable-dev-shm-usage",
			// "--disable-setuid-sandbox",
			// "--no-first-run",
			// "--no-sandbox",
			// "--no-zygote",
			// "--single-process",
		],
		headless: true,
		defaultViewport: {
			width: resolution.width || defaultOptions.resolution.width,
			height: resolution.height || defaultOptions.resolution.height,
		},
	});

	const page = await browser.newPage();

	await page.goto(getCleanedUrl(url), { waitUntil: "networkidle2" });
	await page.waitForTimeout(2000);

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

export { handler };
