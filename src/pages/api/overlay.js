import axios from "axios";
import sharp from "sharp";

export default async function handler(req, res) {
	const { base64String } = req.body;

	const rgb = "210,111,181";

	// TODO: Update home page, determine the absolute path is necessary
	// const home =
	// 	process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://prettypage-sprioleau.vercel.app";

	// TODO: Destructure the BASE64 string
	const { data: overlayImage } = await axios.get("/images/assets/image.png", { responseType: "arraybuffer" });

	// TODO: Investigate getting the buffer from the request to minimize response times
	const sharpImage = Buffer.from(overlayImage, "base64");
	const screenshot = Buffer.from(base64String, "base64");

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

		// TODO: Can I use image.toString("base64")?
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
