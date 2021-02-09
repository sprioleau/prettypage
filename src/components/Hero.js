import React from "react";
import { Flex, Heading } from "@chakra-ui/react";

const Hero = () => {
	return (
		<Flex as="header" px={0} direction="column" mb={8}>
			<Heading
				as="h1"
				size="4xl"
				textAlign="center"
				bgGradient="linear(to-l, #7928CA, #FF0080)"
				bgClip="text"
				fontWeight="extrabold"
				lineHeight="0.9"
				pb={2}
			>
				Pretty Page
			</Heading>
			<Heading as="h2" fontSize="1.5rem" fontWeight="normal" textAlign="center" color="gray.600">
				Take pixel-perfect screenshots of any website
			</Heading>
		</Flex>
	);
};

export default Hero;
