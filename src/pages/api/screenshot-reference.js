import Nightmare from "nightmare";
import browserConfig from "../../utils/browserConfig";
import sharp from "sharp";

export default async function handler(req, res) {
	if (req.method !== "POST") res.status(405).end(); // Method not allowed;

	// const { url, resolution, color, mode } = req.body.options;
	const { url, resolution } = req.body.options;

	// const browserFrameFilename = resolution.value;

	const defaultOptions = {
		resolution: { width: 1280, height: 720 },
		color: null,
		mode: "light",
	};

	const cleanedUrl = !url.startsWith("http") ? `http://${url}` : url;

	const takeScreenshot = async () => {
		try {
			const nightmare = Nightmare({ gotoTimeout: 10000 });

			const screenshot = await nightmare
				.goto(cleanedUrl)
				.viewport(
					resolution.width || defaultOptions.resolution.width,
					resolution.height || defaultOptions.resolution.height
				)
				.screenshot();

			nightmare.end();

			let image = sharp(`src/images/assets/${browserFrameFilename}${mode === "dark" ? "_dark" : ""}.png`).composite([
				{ input: screenshot, top: browserConfig.paddingY + browserConfig.toolbarHeight, left: browserConfig.paddingX },
			]);

			if (color) {
				const { r, g, b } = color;
				image.flatten({ background: { r, g, b } });
			}

			const buffer = Buffer.from(screenshot);
			const base64String = buffer.toString("base64");

			res.status(200).json({ base64String });
		} catch (error) {
			console.error(error);
			res.end();
		}
	};

	await takeScreenshot();
}
