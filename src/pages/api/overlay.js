import axios from "axios";
import sharp from "sharp";

export default async function handler(req, res) {
	const { base64String, value, rgb, mode } = req.body;
	const [r, g, b] = rgb.split(",");

	// prettier-ignore
	const home = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://prettypage.vercel.app";

	const { data: overlayImageArrayBuffer } = await axios.get(`${home}/images/${value}_${mode}.png`, {
		responseType: "arraybuffer",
	});

	const overlayImage = Buffer.from(overlayImageArrayBuffer, "base64");
	const screenshot = Buffer.from(base64String, "base64");

	try {
		const image = sharp(overlayImage)
			.composite([
				{
					input: screenshot,
					top: 170,
					left: 150,
				},
			])
			.flatten({
				background: { r, g, b },
			});

		const buffer = await image.toBuffer();
		const overlayBase64String = buffer.toString("base64");
		const imageUrl = `data:image/png;base64,${overlayBase64String}`;

		res.status(200).json({
			imageUrl,
			error: null,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			imageUrl: null,
			error: error.message,
		});
	}
}
