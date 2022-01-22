// import axios from "axios";
import sharp from "sharp";

export default async function handler(req, res) {
	const { base64String } = req.body;
	// console.log("base64String:", base64String);

	const rgb = "210,111,181";

	// const home =
	// 	process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://prettypage-sprioleau.vercel.app";

	// const { data } = await axios.get(`${home}/api/screenshot`);

	const screenshot = Buffer.from(base64String, "base64");

	try {
		let image = sharp("images/assets/image.png").composite([
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
