import Head from "next/head";
import React from "react";
import GlobalStyle from "../GlobalStyle";
import Layout from "./layout";

const Page = ({ children, title = "Accounting" }) => {
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<link rel="shortcut icon" href="/static/favicon.ico" />
				<title>{title}</title>
			</Head>
			<GlobalStyle />
			<Layout>{children}</Layout>
		</>
	);
};

export default Page;
