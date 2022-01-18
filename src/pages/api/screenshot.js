import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const browserConfig = {
	paddingX: 150,
	paddingY: 120,
	toolbarHeight: 50,
};

export default async function handler(req, res) {
	const { url, height, width, value, mode, rgb } = req.body;

	let browser = null;
	let page = null;

	const cleanedUrl = url.startsWith("http") ? url : `https://${url}`;

	try {
		browser = await puppeteer.launch({
			executablePath: process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
			args: chromium.args,
			headless: true,
			defaultViewport: {
				width: Number(width),
				height: Number(height),
			},
		});

		page = await browser.newPage();

		await page.goto(cleanedUrl, { waitUntil: "networkidle2" });
		await page.waitForTimeout(2000);

		const screenshot = await page.screenshot({ type: "png" });

		let image = sharp(`src/images/assets/${value}_${mode}.png`).composite([
			{
				input: screenshot,
				top: browserConfig.paddingY + browserConfig.toolbarHeight,
				left: browserConfig.paddingX,
			},
		]);

		if (rgb) {
			const [r, g, b] = rgb.split(",");
			image.flatten({ background: { r, g, b } });
		}

		const buffer = await image.toBuffer();
		const base64String = buffer.toString("base64");

		if (page) await page.close();
		if (browser) await browser.close();

		res.status(200).json({
			imageUrl: `data:image/png;base64,${base64String}`,
		});
	} catch (error) {
		console.error(error);

		if (page) await page.close();
		if (browser) await browser.close();

		res.status(500).json({
			imageUrl: null,

			error: error.message,
		});
	}
}
