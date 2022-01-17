import Head from "next/head";
import React from "react";

const HTMLHead = () => (
	<Head>
		<title>Pretty Page</title>
		<meta name="description" content="Take pixel-perfect screenshots of any website" />
		<meta itemprop="name" content="Pretty Page" />
		<meta itemprop="description" content="Take pixel-perfect screenshots of any website" />
		<meta itemprop="image" content="https://prettypage.vercel.app/images/pretty-page-social-card.png" />
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
);

export default HTMLHead;
