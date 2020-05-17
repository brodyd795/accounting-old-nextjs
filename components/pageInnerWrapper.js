import React, { useState } from "react";

import Navbar from "./navbar";
import Main from "./main";

const PageInnerWrapper = ({ children }) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Navbar open={open} setOpen={setOpen} />
			<Main setOpen={setOpen} />
			{children}
		</>
	);
};

export default PageInnerWrapper;
