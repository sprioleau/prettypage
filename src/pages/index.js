import { useState, useRef } from "react";
import axios from "axios";
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
} from "@chakra-ui/react";

import Head from "../components/Head";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import screens from "../utils/screens";
import useDismissOnOutsideClick from "../hooks/useDismissOnOutsideClick";
import { TwitterPicker } from "react-color";
import { BiArrowBack } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
import saveScreenshot from "../utils/saveScreenshot";

const defaults = {
	resolution: {
		width: screens[0].width,
		height: screens[0].height,
		value: screens[0].value,
	},
	colorMode: "light",
	color: { hex: "#FCB900" },
};

const Home = () => {
	const [data, setData] = useState(null);
	const [url, setUrl] = useState("");
	const [resolution, setResolution] = useState(defaults.resolution);
	const [colorPickerOpen, setColorPickerOpen] = useState(false);
	const [color, setColor] = useState(defaults.color);
	const [colorMode, setColorMode] = useState(defaults.colorMode);
	const [loading, setLoading] = useState(false);

	const placeholders = {
		resolution: "Screenshot resolution",
		colorMode: "Color mode",
	};

	const colorPickerRef = useRef(null);

	const options = { url, resolution, color: color.rgb, mode: colorMode };

	const handleChange = (e) => {
		setUrl(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const response = await axios.post("/api/get-screenshot", { options });
		const data = await response.data;
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

	useDismissOnOutsideClick(colorPickerRef, colorPickerOpen, () => setColorPickerOpen(false));

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
			bgColor="gray.100" /* bgGradient="linear(to-br, #7928CA, #FF0080)" */
		>
			<Head />
			<Flex className="app" direction="column" justify="center" height="100vh">
				<Box as="main" px={4}>
					<Container as="section" width="100%" maxW={600} px={8} py={12} boxShadow="xl" p="6" rounded="lg" bg="white">
						<Hero />
						{!data?.base64String ? (
							<form onSubmit={handleSubmit}>
								<Stack spacing={4}>
									<FormControl id="url-input" isRequired>
										<InputGroup size="lg">
											<InputLeftAddon children="http://" />
											<Input placeholder="mysite" value={url} onChange={handleChange} />
										</InputGroup>
									</FormControl>
									<FormControl id="resolution">
										<Select size="lg" placeholder={placeholders.resolution} onChange={handleSelectResolution}>
											{screens.map(({ label, value, resolution }) => (
												<option key={label} value={value}>{`${value} (${resolution})`}</option>
											))}
										</Select>
									</FormControl>
									<RadioGroup value={colorMode} onChange={setColorMode}>
										<Stack direction="row">
											<Radio value="light">Light Mode</Radio>
											<Radio value="dark">Dark Mode</Radio>
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
										<Text fontSize="md">Select Color</Text>
										{colorPickerOpen && (
											<Box position="absolute" zIndex="5" top="calc(100% + 0.25rem)">
												<TwitterPicker color={color} onChangeComplete={(color) => handleSelectColor(color)} />
											</Box>
										)}
									</Button>

									<Button size="lg" isLoading={loading} loadingText="Prettifying" variant="outline" type="submit">
										Prettify
									</Button>
								</Stack>
							</form>
						) : (
							<Container as="section" width="100%" maxW="unset" px={0}>
								<Flex align="center" justify="center" direction="column">
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
											colorScheme="pink"
											variant="outline"
											onClick={handleReset}
											flex="1 1 48%"
										>
											Return Home
										</Button>
										<Button
											size="lg"
											leftIcon={<FiDownload />}
											colorScheme="pink"
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
