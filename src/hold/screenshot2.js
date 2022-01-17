import Nightmare from "nightmare";
import browserConfig from "../utils/browserConfig";
import sharp from "sharp";

export default async function handler(req, res) {
	const { url, resolution, color, mode } = req.body.options;

	const defaultOptions = {
		resolution: { width: 1280, height: 720 },
		color: null,
		mode: "light",
	};

	const cleanedUrl = !url.startsWith("http") ? `http://${url}` : url;

	const takeScreenshot = async () => {
		try {
			const nightmare = Nightmare({
				show: true,
				width: resolution.width || defaultOptions.resolution.width,
				height: resolution.height || defaultOptions.resolution.height,
			});

			const screenshot = await nightmare
				.goto("https://cnn.com")
				// .goto(cleanedUrl)
				.viewport(
					resolution.width || defaultOptions.resolution.width,
					resolution.height || defaultOptions.resolution.height
				)
				.wait(2000)
				.screenshot();

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

			await nightmare.end();

			res.status(200).json({ base64String });
		} catch (error) {
			console.error(error);
			res.end();
		}
	};

	await takeScreenshot();
}
