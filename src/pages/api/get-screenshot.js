import sharp from "sharp";
import browserConfig from "../../utils/browserConfig";
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer";

// let chrome = {};
// let puppeteer;

// https://blog.maximeheckel.com/posts/creating-beautiful-screenshots-source-code-with-serverless-function
const isDev = process.env.NODE_ENV === "development";

const exePath =
	process.platform === "win32"
		? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
		: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export const getOptions = async () => {
	/**
	 * If used in a dev environment, i.e. locally, use one of the local
	 * executable path
	 */
	if (isDev) {
		return {
			args: [],
			executablePath: exePath,
			headless: true,
		};
	}
	/**
	 * Else, use the path of chrome-aws-lambda and its args
	 */
	return {
		args: chrome.args,
		executablePath: await chrome.executablePath,
		headless: chrome.headless,
	};
};

// if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
// 	// running on the Vercel platform.
// 	chrome = require("chrome-aws-lambda");
// 	puppeteer = require("puppeteer-core");
// } else {
// 	puppeteer = require("puppeteer");
// 	// running locally.
// }

// https://github.com/vercel/vercel/discussions/4903
// https://stackoverflow.com/questions/21227078/convert-base64-to-image-in-javascript-jquery

export default async function handler(req, res) {
	if (req.method !== "POST") res.status(405).end(); // Method not allowed;

	const { url, resolution, color, mode } = req.body.options;
	// console.log("req.body.options;:", req.body.options);

	const browserFrameFilename = resolution.value;

	const defaultOptions = {
		resolution: { width: 1280, height: 720 },
		color: null,
		mode: "light",
	};

	const cleanedUrl = !url.startsWith("http") ? `http://${url}` : url;

	const takeScreenshot = async () => {
		try {
			const options = await getOptions(isDev);
			// const browserFetcher = puppeteer.createBrowserFetcher();
			// const revisionInfo = await browserFetcher.download("848005");
			// const browser = await puppeteer.launch({ executablePath: revisionInfo.executablePath });

			// const browser = await puppeteer.launch({ headless: true });

			const browser = await puppeteer.launch({ options });

			const page = await browser.newPage();

			// Configure the navigation timeout
			page.setDefaultNavigationTimeout(0);

			await page.setViewport({
				width: resolution.width ?? defaultOptions.resolution.width,
				height: resolution.height ?? defaultOptions.resolution.height,
				deviceScaleFactor: 1,
			});

			await page.goto(cleanedUrl, { waitUntil: "networkidle2" });

			const screenshot = await page.screenshot();

			await browser.close();

			let image = sharp(`src/images/assets/${browserFrameFilename}${mode === "dark" ? "_dark" : ""}.png`).composite([
				{ input: screenshot, top: browserConfig.paddingY + browserConfig.toolbarHeight, left: browserConfig.paddingX },
			]);

			if (color) {
				const { r, g, b } = color;
				image.flatten({ background: { r, g, b } });
			}

			const buffer = await image.toBuffer();

			res.status(200).json({ base64String: buffer.toString("base64") });
		} catch (error) {
			console.error(error);
			res.end();
		}
	};

	await takeScreenshot();
}

// let bodyHTML = await page.evaluate(() => document.body.innerHTML);
