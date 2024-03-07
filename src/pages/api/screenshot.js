async function getBrowserInstance({ width, height }) {
	const chromium = await import("chrome-aws-lambda").then((module) => module.default);

	const launchOptions = {
		args: chromium.args,
		headless: true,
		defaultViewport: { width, height },
		ignoreHTTPSErrors: true,
	};

	if (!process.env.AWS_LAMBDA_FUNCTION_VERSION) {
		// running locally
		const puppeteer = await import("puppeteer").then((module) => module.default);
		return puppeteer.launch({
			...launchOptions,
			executablePath: puppeteer.executablePath("chrome"),
		});
	} else {
		await import("puppeteer-core").then((module) => module.default);
		// running on the Vercel platform
		return chromium.puppeteer.launch({
			...launchOptions,
			executablePath: await chromium.executablePath,
			headless: chromium.headless,
		});
	}
}

export default async function handler(req, res) {
	const { url, width, height } = req.body;

	// prettier-ignore
	// let browser = null,
	// 		page = null;

	const cleanedUrl = url.startsWith("http") ? url : `https://${url}`;

	try {
		const browser = await getBrowserInstance({ width, height });

		const page = await browser.newPage();
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

		// if (page) await page.close();
		// if (browser) await browser.close();

		res.status(500).json({
			base64String: null,
			error,
		});
	}
}
