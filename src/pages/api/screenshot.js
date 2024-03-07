import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
	const { url, width, height } = req.body;
	const cleanedUrl = url.startsWith("http") ? url : `https://${url}`;

	// Reference: https://github.com/vercel/virtual-event-starter-kit/blob/main/lib/screenshot.ts
	const launchOptions = process.env.AWS_REGION
		? {
				args: chrome.args,
				defaultViewport: { width, height },
				executablePath: await chrome.executablePath,
				headless: chrome.headless,
		  }
		: {
				args: [],
				defaultViewport: { width, height },
				executablePath:
					process.platform === "win32"
						? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
						: process.platform === "linux"
						? "/usr/bin/google-chrome"
						: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
		  };

	// prettier-ignore
	let browser = null,
			page = null;

	try {
		browser = await puppeteer.launch(launchOptions);

		page = await browser.newPage();
		await page.goto(cleanedUrl, { waitUntil: "networkidle2" });
		await page.waitForNetworkIdle();

		const screenshot = await page.screenshot({
			type: "png",
			clip: {
				x: 0,
				y: 0,
				width,
				height,
			},
		});

		const buffer = Buffer.from(screenshot);
		const base64String = buffer.toString("base64");

		if (page) await page.close();
		if (browser) await browser.close();

		const sizeInBytes = base64String.length * (3 / 4) - 2;
		const sizeInMegabytes = (sizeInBytes / 1_000_000).toFixed(1);

		if (sizeInBytes > 1_000_000) {
			res.status(413).json({
				base64String,
				error: `Your screenshot was ${sizeInMegabytes}mb. Websites with simple images in the intro section work best`,
			});
		} else {
			res.status(200).json({
				base64String,
				error: null,
			});
		}
	} catch (error) {
		console.error(error);

		if (page) await page.close();
		if (browser) await browser.close();

		res.status(500).json({
			base64String: null,
			error,
		});
	}
}
