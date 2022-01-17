import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Flex,
	FormControl,
	Image,
	Input,
	InputGroup,
	InputLeftAddon,
	Radio,
	RadioGroup,
	Select,
	Stack,
	Text,
	useColorMode,
} from "@chakra-ui/react";

import { BiArrowBack } from "react-icons/bi";
import { CgDarkMode } from "react-icons/cg";
import Confetti from "react-confetti";
import { FiDownload } from "react-icons/fi";
import Footer from "../components/Footer";
import Head from "next/head";
import Hero from "../components/Hero";
import { TwitterPicker } from "react-color";
import axios from "axios";
import { getTimeStamp } from "../utils/getTimeStamp";
import { saveAs } from "file-saver";
import screens from "../utils/screens";
import { useState } from "react";
import { useWindowSize } from "react-use";

const defaults = {
	url: "sprioleau.dev",
	resolution: {
		width: screens[0].width,
		height: screens[0].height,
		value: screens[0].value,
	},
	colorMode: "light",
	color: { rgb: { r: 123, g: 220, b: 181 } },
};

const getRgbColor = ({ r, g, b }) => `rgb(${r}, ${g}, ${b})`;

const Home = () => {
	const [data, setData] = useState(null);
	const [url, setUrl] = useState(defaults.url);
	const [resolution, setResolution] = useState(defaults.resolution);
	const [colorPickerOpen, setColorPickerOpen] = useState(false);
	const [color, setColor] = useState(defaults.color);
	const [screenshotColorMode, setScreenshotColorMode] = useState(defaults.colorMode);
	const [loading, setLoading] = useState(false);

	const { colorMode, toggleColorMode } = useColorMode();
	const { width: windowWidth, height: windowHeight } = useWindowSize();

	const placeholders = {
		resolution: "Screenshot resolution",
		colorMode: "Color mode",
	};

	const options = { url, resolution, color: color.rgb, mode: screenshotColorMode };
	const config = {
		headers: {
			"Access-Control-Allow-Headers": "*",
		},
	};

	const handleChange = (e) => {
		setUrl(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const { data } = await axios.post("/api/hello?name=ME", { options }, config);
		setLoading(false);
		setData(data);
	};

	const handleSelectResolution = (e) => {
		const inputValue = e.target.value;
		if (!inputValue) return setResolution(defaults.resolution);
		const { width, height, value } = screens.find((screen) => screen.value === inputValue);
		setResolution({ width, height, value });
	};

	const handleSelectColor = (color) => {
		setColor(color);
	};

	const toggleColorPickerVisibility = () => {
		setColorPickerOpen(!colorPickerOpen);
	};

	const handleReset = () => {
		setData({});
	};

	const handleDownload = () => {
		if (!data) return;
		saveAs(`data:image/png;base64,${data.base64String}`, `pretty-page-screenshot_${getTimeStamp()}.png`);
	};

	const pageBgColor = colorMode === "light" ? "gray.100" : "gray.900";

	return (
		<Flex as="div" className="app" direction="column" bgColor={pageBgColor}>
			<Head>
				<title>Pretty Page</title>
			</Head>
			<Flex className="app" direction="column" justify="space-between" height="100vh">
				<Container display="flex" justifyContent="center" my={8}>
					<Button onClick={toggleColorMode} leftIcon={<CgDarkMode />} bgColor="gray.300" textColor="gray.900">
						Toggle {colorMode === "light" ? "Dark" : "Light"} Mode
					</Button>
				</Container>

				<Box as="main" px={4} bgColor={pageBgColor}>
					{!data?.base64String ? (
						<Container
							as="section"
							width="100%"
							maxW={600}
							boxShadow="xl"
							p={8}
							borderRadius="xl"
							mb={24}
							bgColor={colorMode === "light" ? "white" : "gray.900"}
							border="1px solid"
							borderColor="gray.400"
						>
							<form onSubmit={handleSubmit}>
								<Stack spacing={4} my={6}>
									<Hero />
									<FormControl id="url-input" isRequired>
										<InputGroup size="lg">
											<InputLeftAddon children="http://" />
											<Input placeholder="mysite" value={url} onChange={handleChange} autoFocus />
										</InputGroup>
									</FormControl>
									<FormControl id="resolution">
										<Select size="lg" placeholder={placeholders.resolution} onChange={handleSelectResolution}>
											{screens.map(({ label, value, resolution }) => (
												<option key={label} value={value}>{`${value} (${resolution})`}</option>
											))}
										</Select>
									</FormControl>
									<RadioGroup value={screenshotColorMode} onChange={setScreenshotColorMode}>
										<Stack direction="row">
											<Text>Screenshot Color Mode: </Text>
											<Radio value="light">Light</Radio>
											<Radio value="dark">Dark</Radio>
										</Stack>
									</RadioGroup>

									<Button
										className="color-picker"
										bgColor={getRgbColor(color.rgb)}
										flexGrow="1"
										size="lg"
										position="relative"
										onClick={toggleColorPickerVisibility}
										_hover={{ backgroundColor: getRgbColor(color.rgb) }}
										_active={{ backgroundColor: getRgbColor(color.rgb) }}
									>
										<Text fontSize="md" color="gray.900">
											Select Color
										</Text>
										{colorPickerOpen && (
											<Box position="absolute" zIndex="5" top="calc(100% + 0.25rem)">
												<TwitterPicker color={color} onChangeComplete={(color) => handleSelectColor(color)} />
											</Box>
										)}
									</Button>

									<Button
										size="lg"
										isLoading={loading}
										loadingText="Prettifying"
										colorScheme="purple"
										variant="solid"
										type="submit"
									>
										Prettify
									</Button>
								</Stack>
							</form>
						</Container>
					) : (
						<Container as="section" width="clamp(300px, 90%, 1000px)" maxW="unset" px={6}>
							<Flex align="center" justify="center" direction="column">
								<Confetti
									width={windowWidth}
									height={windowHeight}
									numberOfPieces={250}
									colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4"]}
									recycle={false}
								/>
								<Image
									src={`data:image/png;base64,${data.base64String}`}
									alt={`screenshot of ${url}`}
									width="100%"
									height="auto"
									display="block"
									mb={4}
									className="screenshot"
									borderRadius="lg"
								/>
								<ButtonGroup
									display="flex"
									flexWrap="wrap"
									style={{ gap: "1rem" }}
									width="100%"
									justifyContent="center"
								>
									<Button
										size="lg"
										leftIcon={<BiArrowBack />}
										colorScheme="purple"
										variant="outline"
										onClick={handleReset}
										flex="1 1 48%"
									>
										Return Home
									</Button>
									<Button
										size="lg"
										leftIcon={<FiDownload />}
										colorScheme="purple"
										variant="solid"
										onClick={handleDownload}
										style={{ marginLeft: 0 }}
										flex="1 1 48%"
									>
										Download
									</Button>
								</ButtonGroup>
							</Flex>
						</Container>
					)}
				</Box>

				<Footer />
			</Flex>
		</Flex>
	);
};

export default Home;
