import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Image,
	Input,
	InputGroup,
	Radio,
	RadioGroup,
	Stack,
	Text,
	Tooltip,
	useColorMode,
	useToast,
} from "@chakra-ui/react";
import { defaultOptions, exampleUrls, screens } from "../constants";
import { fetchData, getRgbColor, getTimeStamp, pickRandomFromArray } from "../utils";

import { BiArrowBack } from "react-icons/bi";
import { CgDarkMode } from "react-icons/cg";
import Confetti from "react-confetti";
import { FiDownload } from "react-icons/fi";
import Footer from "../components/Footer";
import Head from "next/head";
import Hero from "../components/Hero";
import { RiScreenshot2Line } from "react-icons/ri";
import { TwitterPicker } from "react-color";
import { saveAs } from "file-saver";
import { useState } from "react";
import { useWindowSize } from "react-use";

const Home = () => {
	const [imageUrl, setImageUrl] = useState(null);
	const [url, setUrl] = useState(defaultOptions.url);
	const [resolution, setResolution] = useState(defaultOptions.resolution);
	const [colorPickerOpen, setColorPickerOpen] = useState(false);
	const [color, setColor] = useState(defaultOptions.color);
	const [screenshotColorMode, setScreenshotColorMode] = useState(defaultOptions.colorMode);
	const [loading, setLoading] = useState(false);
	const toast = useToast({
		position: "top",
		status: "error",
		isClosable: true,
	});

	const { colorMode, toggleColorMode } = useColorMode();
	const { width: windowWidth, height: windowHeight } = useWindowSize();

	// const placeholders = {
	// 	resolution: "Screenshot resolution",
	// 	colorMode: "Color mode",
	// };

	const options = {
		screenshot: {
			url,
			width: Number(resolution.width),
			height: Number(resolution.height),
		},
		overlay: {
			value: resolution.value,
			rgb: Object.values(color.rgb).join(","),
			mode: screenshotColorMode,
		},
	};

	const randomOptions = {
		...options,
		screenshot: {
			...options.screenshot,
			url: pickRandomFromArray(exampleUrls),
		},
	};

	const handleChange = (e) => {
		setUrl(e.target.value);
	};

	const handleSubmit = async (e, options) => {
		e.preventDefault();
		setLoading(true);
		setImageUrl(null);
		setColorPickerOpen(false);

		if (!url && options.screenshot.url) setUrl(options.screenshot.url);

		// Serverless function uses puppeteer to take screenshot
		const {
			data: { base64String, error: screenshotError },
		} = await fetchData("/api/screenshot", options.screenshot);

		if (screenshotError) {
			setLoading(false);
			return toast({ title: screenshotError });
		}

		// Serverless function uses sharp to overlay background color and browser
		const {
			data: { imageUrl, error: overlayError },
		} = await fetchData(`/api/overlay`, { base64String, ...options.overlay });

		if (overlayError) {
			setLoading(false);
			return toast({ title: overlayError });
		}

		setLoading(false);
		setImageUrl(imageUrl);
	};

	const handleSelectResolution = (optionResolution) => {
		// const inputValue = e.target.value;
		// if (!inputValue) return setResolution(defaultOptions.resolution);
		const {
			width,
			height,
			value,
			resolution: screenResolution,
		} = screens.find((screen) => screen.resolution === optionResolution);
		setResolution({ width, height, value, resolution: screenResolution });
	};

	const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
	const regexValid = urlRegex.test(url);
	const showUrlInvalidState = !regexValid && url.length > 3;

	const handleSelectColor = (color) => {
		setColor(color);
	};

	const toggleColorPickerVisibility = () => {
		setColorPickerOpen(!colorPickerOpen);
	};

	const handleReset = () => {
		setImageUrl("");
	};

	const handleDownload = () => {
		if (!imageUrl) return;
		saveAs(imageUrl, `pretty-page-screenshot_${getTimeStamp()}.png`);
	};

	const pageBgColor = colorMode === "light" ? "gray.100" : "gray.900";

	return (
		<Flex as="div" className="app" direction="column" bgColor={pageBgColor}>
			<Head>
				<title>Pretty Page</title>
			</Head>
			<Flex className="app" direction="column" justify="space-between" minHeight="100vh">
				<Container display="flex" justifyContent="center" my={8} mb={4}>
					<Button onClick={toggleColorMode} leftIcon={<CgDarkMode />} bgColor="gray.300" textColor="gray.900">
						Toggle {colorMode === "light" ? "Dark" : "Light"} Mode
					</Button>
				</Container>

				<Box as="main" px={4} bgColor={pageBgColor}>
					{!imageUrl ? (
						<Container
							as="section"
							width="100%"
							maxW={600}
							boxShadow="xl"
							p={8}
							borderRadius="xl"
							mb={12}
							bgColor={colorMode === "light" ? "white" : "gray.900"}
							border="1px solid"
							borderColor="gray.400"
						>
							<form onSubmit={(e) => handleSubmit(e, options)}>
								<Stack spacing={4} my={6}>
									<Hero />
									<FormControl id="url-input" isRequired isInvalid={showUrlInvalidState} isDisabled={loading}>
										<FormLabel htmlFor="url-input">URL</FormLabel>
										<InputGroup size="lg">
											<Input
												placeholder="https://sprioleau.dev"
												value={url}
												onChange={handleChange}
												autoFocus
												spellCheck={false}
											/>
										</InputGroup>
										{showUrlInvalidState ? <FormErrorMessage>Please enter a valid URL</FormErrorMessage> : null}
									</FormControl>
									<FormControl id="resolution" isDisabled={loading}>
										<Stack direction="column">
											<Text mr={4} flexGrow={1}>
												Screenshot Resolution:
											</Text>
											<Stack direction="row">
												{screens.map(({ label, value, resolution: optionResolution }) => (
													<Tooltip
														key={label}
														label={optionResolution}
														aria-label={`tooltip for ${optionResolution}`}
														hasArrow
														placement="top"
													>
														<Button
															variant={resolution.resolution === optionResolution ? "solid" : "outline"}
															colorScheme="purple"
															onClick={() => handleSelectResolution(optionResolution)}
														>
															{value}
														</Button>
													</Tooltip>
												))}
											</Stack>
										</Stack>
									</FormControl>
									<RadioGroup value={screenshotColorMode} onChange={setScreenshotColorMode} isDisabled={loading}>
										<Stack direction="row">
											<Text>Screenshot Color Mode: </Text>
											<Radio value="light">Light</Radio>
											<Radio value="dark">Dark</Radio>
										</Stack>
									</RadioGroup>

									<Box position="relative">
										<Button
											className="color-picker"
											bgColor={getRgbColor(color.rgb)}
											flexGrow="1"
											size="lg"
											width="full"
											onClick={toggleColorPickerVisibility}
											_hover={{ backgroundColor: getRgbColor(color.rgb) }}
											_active={{ backgroundColor: getRgbColor(color.rgb) }}
											isDisabled={loading}
										>
											<Text fontSize="md" color="gray.900">
												Select Color
											</Text>
										</Button>
										{colorPickerOpen && (
											<Box
												position="absolute"
												zIndex="5"
												top="calc(100% + 0.25rem)"
												left="50%"
												transform="translateX(-50%)"
											>
												<TwitterPicker color={color} onChangeComplete={(color) => handleSelectColor(color)} />
											</Box>
										)}
									</Box>

									<Button
										size="lg"
										isLoading={loading}
										isDisabled={loading}
										loadingText="Prettifying"
										colorScheme="purple"
										variant="solid"
										type="submit"
									>
										Prettify
									</Button>
									<Text
										fontSize="lg"
										colorScheme="purple"
										opacity={0.8}
										textAlign="center"
										_hover={{
											color: "purple.200",
											cursor: "pointer",
											opacity: 1,
										}}
										onClick={(e) => handleSubmit(e, randomOptions)}
									>
										or see an example
									</Text>
								</Stack>
							</form>
						</Container>
					) : (
						<Container as="section" width="clamp(300px, 90%, 1000px)" maxW="unset" px={6} mb={12}>
							<Flex align="center" justify="center" direction="column">
								<Confetti
									width={windowWidth}
									height={windowHeight}
									numberOfPieces={250}
									colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4"]}
									recycle={false}
								/>
								<Image
									src={imageUrl}
									alt="screenshot"
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
									mb={4}
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
										colorScheme="purple"
										leftIcon={<RiScreenshot2Line />}
										variant="outline"
										onClick={handleSubmit}
										style={{ marginLeft: 0 }}
										color="purple.200"
										flex="1 1 48%"
									>
										Retake Screenshot
									</Button>
								</ButtonGroup>
								<ButtonGroup
									display="flex"
									flexWrap="wrap"
									style={{ gap: "1rem" }}
									width="100%"
									justifyContent="center"
								>
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