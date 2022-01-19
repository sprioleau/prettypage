import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
// import sharp from "sharp";

// const browserConfig = {
// 	paddingX: 150,
// 	paddingY: 120,
// 	toolbarHeight: 50,
// };

export default async function handler(req, res) {
	// const { url, height, width, value, mode, rgb } = JSON.parse(req.body);
	// const { url, height, width, value, mode, rgb } = req.body;

	// const rgb = "210,111,181";

	let browser = null;
	let page = null;

	// const cleanedUrl = url.startsWith("http") ? url : `https://${url}`;

	try {
		browser = await puppeteer.launch({
			executablePath: await chromium.executablePath,
			// executablePath: process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
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
		// await page.goto(cleanedUrl, { waitUntil: "networkidle2" });
		await page.waitForTimeout(2000);

		const screenshot = await page.screenshot({ type: "png" });

		// res.status(200).json({
		// 	screenshot
		// });

		// let image = sharp(`src/images/assets/720p_light.png`).composite([
		// 	// let image = sharp(`src/images/assets/${value}_${mode}.png`).composite([
		// 	{
		// 		input: screenshot,
		// 		top: browserConfig.paddingY + browserConfig.toolbarHeight,
		// 		left: browserConfig.paddingX,
		// 	},
		// ]);

		// if (rgb) {
		// 	const [r, g, b] = rgb.split(",");
		// 	image.flatten({ background: { r, g, b } });
		// }

		const buffer = Buffer.from(screenshot);
		// const buffer = await image.toBuffer();
		const base64String = buffer.toString("base64");

		if (page) await page.close();
		if (browser) await browser.close();

		res.status(200).json({
			// base64String: `data:image/png;base64,${base64String}`,
			// screenshot,
			base64String,
		});

		// res
		// 	.status(200)
		// 	.send(`<img class="screenshot" width="50%" height="auto" src="data:image/png;base64,${base64String}" />`);
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
