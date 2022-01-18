import { browserConfig, defaultOptions } from "../../constants";

import chromium from "chrome-aws-lambda";
import { getCleanedUrl } from "../../utils";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

export default async function handler(req, res) {
	const { url, resolution, color, mode } = req.body;

	const browser = await puppeteer.launch({
		executablePath: process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
		args: chromium.args,
		headless: true,
		defaultViewport: {
			width: resolution.width || defaultOptions.resolution.width,
			height: resolution.height || defaultOptions.resolution.height,
		},
	});

	const page = await browser.newPage();

	await page.goto(getCleanedUrl(url), { waitUntil: "networkidle0" });
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

	res.status(200).json({ base64String });
}
