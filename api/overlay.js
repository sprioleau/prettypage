import axios from "axios";
import sharp from "sharp";

export default async function handler(req, res) {
	const rgb = "210,111,181";

	const home =
		process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://prettypage-sprioleau.vercel.app";

	const { data } = await axios.get(`${home}/api/screenshot`);
	const { data: overlayImage } = await axios.get(`${home}/images/assets/image.png`, { responseType: "arraybuffer" });

	const sharpImage = Buffer.from(overlayImage, "base64");
	const screenshot = Buffer.from(data.base64String, "base64");

	try {
		let image = sharp(sharpImage).composite([
			{
				input: screenshot,
				top: 170,
				left: 150,
			},
		]);

		if (rgb) {
			const [r, g, b] = rgb.split(",");
			image.flatten({ background: { r, g, b } });
		}

		const buffer2 = await image.toBuffer();
		const base64String2 = buffer2.toString("base64");
		const imageUrl = `data:image/png;base64,${base64String2}`;

		res.status(200).json({
			imageUrl,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			imageUrl: null,
			error: error.message,
		});
	}
}
