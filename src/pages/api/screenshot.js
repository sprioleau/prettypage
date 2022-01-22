import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
	let browser = null;
	let page = null;

	// const cleanedUrl = url.startsWith("http") ? url : `https://${url}`;

	try {
		browser = await puppeteer.launch({
			// executablePath: await chromium.executablePath,
			executablePath: process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
			args: chromium.args,
			headless: true,
			defaultViewport: {
				width: 1280,
				height: 720,
				// width: Number(width),
				// height: Number(height),
			},
		});

		page = await browser.newPage();
		await page.goto("https://sprioleau.dev", { waitUntil: "networkidle2" });
		await page.waitForTimeout(2000);

		const screenshot = await page.screenshot({ type: "png" });
		const buffer = Buffer.from(screenshot);
		const base64String = buffer.toString("base64");

		if (page) await page.close();
		if (browser) await browser.close();

		res.status(200).json({
			base64String,
		});
	} catch (error) {
		console.error(error);

		if (page) await page.close();
		if (browser) await browser.close();

		res.status(500).json({
			screenshot: null,
			error: error.message,
		});
	}
}
