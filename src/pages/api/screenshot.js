import chromium from "chrome-aws-lambda";
// import puppeteer from "puppeteer-extra";
// import puppeteer from "puppeteer-core";

async function getBrowserInstance({ width, height }) {
	const executablePath = await chromium.executablePath;
	console.log("🚀 ~ getBrowserInstance ~ executablePath:", executablePath);

	// prettier-ignore
	const launchOptions = {
		args: chromium.args,
		headless: true,
		defaultViewport: { width, height },
		ignoreHTTPSErrors: true,
	};

	if (!executablePath) {
		// running locally
		const puppeteer = require("puppeteer");
		return puppeteer.launch(launchOptions);
	}

	return chromium.puppeteer.launch({
		...launchOptions,
		executablePath,
		headless: chromium.headless,
	});
	// return chromium.puppeteer.launch({
	// 	args: chromium.args,
	// 	headless: chromium.headless,
	// 	defaultViewport: {
	// 		width,
	// 		height,
	// 	},
	// 	executablePath,
	// 	ignoreHTTPSErrors: true,
	// });
}

export default async function handler(req, res) {
	const { url, width, height } = req.body;

	let browser = null;
	let page = null;

	const cleanedUrl = url.startsWith("http") ? url : `https://${url}`;

	try {
		browser = await getBrowserInstance({ width, height });
		// browser = await chromium.puppeteer.launch({
		// 	executablePath: await chromium.executablePath,
		// 	args: [
		// 		"--disable-gpu",
		// 		"--disable-dev-shm-usage",
		// 		"--disable-setuid-sandbox",
		// 		"--no-first-run",
		// 		"--no-sandbox",
		// 		"--no-zygote",
		// 		"--single-process",
		// 	],
		// 	headless: true,
		// 	defaultViewport: {
		// 		width,
		// 		height,
		// 	},
		// });

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
