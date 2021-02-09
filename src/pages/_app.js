import { ChakraProvider } from "@chakra-ui/react";

import "../styles/styles.scss";
import theme from "../theme/theme";

function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider theme={theme}>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default MyApp;
