import { Box, Container, Link, ListItem, Stack, UnorderedList } from "@chakra-ui/layout";

const Footer = () => (
	<Box as="footer" p="3rem 0">
		<Container display="flex" justifyContent="center" alignItems="center">
			<UnorderedList
				listStyleType="none"
				m={0}
				p={0}
				display="flex"
				justifyContent="center"
				flexWrap="wrap"
				style={{ gap: "1rem" }}
				w="100%"
			>
				<ListItem textAlign="center">
					<Link href="https://github.com/sprioleau/prettypage" _hover={{ color: "teal" }}>
						source
					</Link>
				</ListItem>
				<ListItem textAlign="center">
					<Link href="https://github.com/sprioleau" _hover={{ color: "teal" }}>
						about
					</Link>
				</ListItem>
				<ListItem textAlign="center">
					created by{" "}
					<Link href="https://github.com/sprioleau" _hover={{ color: "teal" }}>
						@sprioleau
					</Link>
					👨🏾‍💻
				</ListItem>
			</UnorderedList>
		</Container>
	</Box>
);

export default Footer;
