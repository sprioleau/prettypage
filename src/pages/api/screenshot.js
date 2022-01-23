import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
	const { url, width, height } = req.body;

	let browser = null;
	let page = null;

	const cleanedUrl = url.startsWith("http") ? url : `https://${url}`;

	try {
		browser = await puppeteer.launch({
			executablePath: await chromium.executablePath,
			args: chromium.args,
			headless: true,
			defaultViewport: {
				width,
				height,
			},
		});

		page = await browser.newPage();
		await page.goto(cleanedUrl, { waitUntil: "networkidle2" });
		await page.waitForTimeout(2000);

		const screenshot = await page.screenshot({ type: "png" });
		const buffer = Buffer.from(screenshot);
		const base64String = buffer.toString("base64");

		if (page) await page.close();
		if (browser) await browser.close();

		res.status(200).json({
			base64String,
			error: null,
		});
	} catch (error) {
		console.error(error);

		if (page) await page.close();
		if (browser) await browser.close();

		const sizeInBytes = base64String * (3 / 4) - 2;

		if (sizeInBytes > 1000000) {
			res.status(413).json({
				base64String: null,
				error: "Image is too large",
			});
		}

		res.status(500).json({
			base64String: null,
			error: error.message,
		});
	}
}
