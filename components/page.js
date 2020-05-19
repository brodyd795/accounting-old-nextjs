import Head from "next/head";
import React from "react";
import GlobalStyle from "./GlobalStyle";
import Layout from "./layout";

const Page = ({ children, title = "Accounting" }) => {
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />

				<title>{title}</title>
				{/* 
				<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
				<script
					type="text/javascript"
					src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
				<script
					type="text/javascript"
					src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
				<link
					rel="stylesheet"
					type="text/css"
					href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css"
				/> */}
			</Head>
			<GlobalStyle />
			<Layout />
			{children}
		</>
	);
};

export default Page;
