import { useState, useRef } from "react";
import axios from "axios";

import Image from "next/image";
import Head from "../components/Head";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import screens from "../utils/screens";
import browserConfig from "../utils/browserConfig";
import useDismissOnOutsideClick from "../hooks/useDismissOnOutsideClick";
import { TwitterPicker } from "react-color";

const Home = () => {
	const [data, setData] = useState(null);
	const [url, setUrl] = useState("");
	const [resolution, setResolution] = useState({
		width: screens[0].width,
		height: screens[0].height,
		value: screens[0].value,
	});
	const [colorPickerOpen, setColorPickerOpen] = useState(false);
	const [color, setColor] = useState({});
	const [mode, setMode] = useState("light");

	const colorPickerRef = useRef(null);

	const handleChange = (e) => {
		setUrl(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await axios.post("/api/get-screenshot", {
			options: {
				url,
				resolution,
				color,
				mode,
			},
		});
		const data = await response.data;
		setData(data);
	};

	const handleChangeMode = (e) => {
		e.preventDefault();
		setMode(e.target.value);
	};

	const handleSelectResolution = (e) => {
		e.preventDefault();
		const screen = screens.find((screen) => screen.value === e.target.value);
		setResolution({ width: screen.width, height: screen.height, value: screen.value });
	};

	const handleSelectColor = (color) => {
		setColor(color.rgb);
	};

	useDismissOnOutsideClick(colorPickerRef, colorPickerOpen, () => setColorPickerOpen(false));

	const toggleColorPickerVisibility = () => {
		setColorPickerOpen(!colorPickerOpen);
	};

	return (
		<div className="app" style={{ margin: "0 auto", maxWidth: 1400 }}>
			<Head />
			<Hero />

			<main className="main">
				<>
					<form onSubmit={handleSubmit}>
						<label htmlFor="url-input">URL</label>
						<input id="url-input" type="text" onChange={handleChange} value={url} />
						<select name="resolution" id="resolution" onChange={handleChangeMode}>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
						</select>
						<select name="resolution" id="resolution" onChange={handleSelectResolution}>
							{screens.map(({ label, value, resolution }) => (
								<option key={label} value={value}>{`${value} (${resolution})`}</option>
							))}
						</select>
						<button type="submit">Get screenshot</button>
					</form>
					<div ref={colorPickerRef} className="color-picker">
						<div
							onClick={toggleColorPickerVisibility}
							className="current-color"
							style={{
								backgroundColor: null ?? `rgb(${color.r}, ${color.g}, ${color.b})`,
								width: 500,
								height: 50,
							}}
						/>
						<button className="color-picker__button" onClick={toggleColorPickerVisibility}>
							<h3>Open Color Picker</h3>
						</button>
						{colorPickerOpen && <TwitterPicker color={color} onChangeComplete={(color) => handleSelectColor(color)} />}
					</div>
					{data?.base64String && (
						<img
							src={`data:image/png;base64,${data.base64String}`}
							alt={`screenshot of ${url}`}
							width="100%"
							height="auto"
						/>
					)}
				</>
			</main>
			<Footer />
		</div>
	);
};

export default Home;
