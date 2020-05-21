import React, { useState } from "react";

import Navbar from "./navbar";
import Header from "./header";
import Main from "./main";

const Layout = ({ children }) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Navbar open={open} setOpen={setOpen} />
			<Header setOpen={setOpen} children />
			<Main children={children} />
		</>
	);
};

export default Layout;
