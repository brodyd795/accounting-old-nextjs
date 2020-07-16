import React, { useState } from "react";
import { UserProvider } from "../../lib/user";

import Navbar from "./navbar";
import Header from "./header";
import Main from "./main";

const Layout = ({ user, loading = false, children }) => {
	const [open, setOpen] = useState(false);

	return (
		<UserProvider value={{ user, loading }}>
			<Navbar open={open} setOpen={setOpen} />
			<Header setOpen={setOpen} children />
			<Main children={children} />
		</UserProvider>
	);
};

export default Layout;
