import React, { useState } from "react";

import Navbar from "./navbar";
import Header from "./header";

const Layout = ({ children }) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Navbar open={open} setOpen={setOpen} />
			<Header setOpen={setOpen} children />
		</>
	);
};

export default Layout;
