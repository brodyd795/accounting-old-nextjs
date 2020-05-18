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

				{/* <link
					rel="stylesheet"
					href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
					integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4"
					crossOrigin="anonymous"
				/> */}

				{/* <script
					defer
					src="https://use.fontawesome.com/releases/v5.0.13/js/solid.js"
					integrity="sha384-tzzSw1/Vo+0N5UhStP3bvwWPq+uvzCMfrN1fEFe+xBmv1C/AtVX5K0uZtmcHitFZ"
					crossOrigin="anonymous"></script>
				<script
					defer
					src="https://use.fontawesome.com/releases/v5.0.13/js/fontawesome.js"
					integrity="sha384-6OIrr52G08NpOFSZdxxz1xdNSndlD4vdcf/q2myIUVO0VsqaGHJsB0RaBE01VTOY"
					crossOrigin="anonymous"></script>
				<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
				<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
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
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
			</Head>
			<GlobalStyle />
			<Layout />
			{children}
		</>
	);
};

export default Page;
