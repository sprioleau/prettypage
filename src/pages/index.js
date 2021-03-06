import { useState, useRef } from "react";
import axios from "axios";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

import Head from "../components/Head";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import screens from "../utils/screens";
import { TwitterPicker } from "react-color";
import { BiArrowBack } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
import { CgDarkMode } from "react-icons/cg";
import saveScreenshot from "../utils/saveScreenshot";
import {
	InputGroup,
	InputLeftAddon,
	Input,
	Stack,
	Container,
	Flex,
	FormControl,
	Select,
	Button,
	Image,
	Box,
	Text,
	ButtonGroup,
	RadioGroup,
	Radio,
	useColorMode,
} from "@chakra-ui/react";

const defaults = {
	resolution: {
		width: screens[0].width,
		height: screens[0].height,
		value: screens[0].value,
	},
	colorMode: "light",
	color: { hex: "#7BDCB5" },
};

const Home = () => {
	const [data, setData] = useState(null);
	const [url, setUrl] = useState("");
	const [resolution, setResolution] = useState(defaults.resolution);
	const [colorPickerOpen, setColorPickerOpen] = useState(false);
	const [color, setColor] = useState(defaults.color);
	const [screenshotColorMode, setScreenshotColorMode] = useState(defaults.colorMode);
	const [loading, setLoading] = useState(false);

	const { colorMode, toggleColorMode } = useColorMode();
	const { width, height } = useWindowSize();

	const home = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://prettypage.vercel.app";

	const placeholders = {
		resolution: "Screenshot resolution",
		colorMode: "Color mode",
	};

	// const colorPickerRef = useRef(null);

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
		const response = await axios.post(`${home}/api/screenshot`, { options }, config);
		const data = await response.data;
		console.log("data:", data);
		setLoading(false);
		setData(data);
	};

	const handleSelectResolution = (e) => {
		e.preventDefault();
		const value = e.target.value;
		if (!value) return setResolution(defaults.resolution);
		const screen = screens.find((screen) => screen.value === value);
		setResolution({ width: screen.width, height: screen.height, value: screen.value });
	};

	const handleSelectColor = (color) => {
		setColor(color);
	};

	// useDismissOnOutsideClick(colorPickerRef, colorPickerOpen, () => setColorPickerOpen(false));

	const toggleColorPickerVisibility = () => {
		setColorPickerOpen(!colorPickerOpen);
	};

	const handleReset = () => {
		setData({});
	};

	return (
		<Flex
			as="div"
			className="app"
			direction="column"
			/* bgColor="gray.100" /* bgGradient="linear(to-br, #7928CA, #FF0080)" */
		>
			<Head />
			<Flex className="app" direction="column" justify="space-between" height="100vh">
				<Container display="flex" justifyContent="center" my={8}>
					<Button onClick={toggleColorMode} leftIcon={<CgDarkMode />}>
						Toggle {colorMode === "light" ? "Dark" : "Light"} Mode
					</Button>
				</Container>

				<Box as="main" px={4}>
					<Container as="section" width="100%" maxW={600} px={8} py={12} boxShadow="xl" p="6" rounded="lg">
						<Hero />
						{!data?.base64String ? (
							<form onSubmit={handleSubmit}>
								<Stack spacing={4}>
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
										bgColor={color.hex}
										flexGrow="1"
										size="lg"
										position="relative"
										onClick={toggleColorPickerVisibility}
										_hover={{ backgroundColor: color.hex }}
										_active={{ backgroundColor: color.hex }}
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
						) : (
							<Container as="section" width="100%" maxW="unset" px={0}>
								<Flex align="center" justify="center" direction="column">
									<Confetti
										width={width}
										height={height}
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
											onClick={saveScreenshot}
											style={{ marginLeft: 0 }}
											flex="1 1 48%"
										>
											Download
										</Button>
									</ButtonGroup>
								</Flex>
							</Container>
						)}
					</Container>
				</Box>

				<Footer />
			</Flex>
		</Flex>
	);
};

export default Home;
