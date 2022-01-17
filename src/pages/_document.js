import NextDocument, { Head, Html, Main, NextScript } from "next/document";

import { ColorModeScript } from "@chakra-ui/react";
import theme from "../theme/theme";

export default class Document extends NextDocument {
	render() {
		return (
			<Html lang="en">
				<Head>
					<meta name="description" content="Take pixel-perfect screenshots of any website" />
					<meta itemProp="name" content="Pretty Page" />
					<meta itemProp="description" content="Take pixel-perfect screenshots of any website" />
					<meta itemProp="image" content="https://prettypage.vercel.app/images/pretty-page-social-card.png" />
					<meta property="og:url" content="https://prettypage.vercel.app" />
					<meta property="og:type" content="website" />
					<meta property="og:title" content="Pretty Page" />
					<meta property="og:description" content="Take pixel-perfect screenshots of any website" />
					<meta property="og:image" content="https://prettypage.vercel.app/images/pretty-page-social-card.png" />
					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:title" content="Pretty Page" />
					<meta name="twitter:description" content="Take pixel-perfect screenshots of any website" />
					<meta name="twitter:image" content="https://prettypage.vercel.app/images/pretty-page-social-card.png" />
					<link rel="icon" href="/favicon.png" />
				</Head>
				<body>
					<ColorModeScript initialColorMode={theme.config.initialColorMode} />
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
