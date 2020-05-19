import React, { useState } from "react";
import styled from "styled-components";

import Navbar from "./navbar";
import Header from "./header";

const StyledDiv = styled.div`
	@media (min-width: 768px) {
		margin-top: 0;
	}
	p {
		margin: 0;
		padding-top: 20px;
	}
`;

const Layout = ({ children }) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Navbar open={open} setOpen={setOpen} />
			<Header setOpen={setOpen} children />
			<StyledDiv>{children}</StyledDiv>
		</>
	);
};

export default Layout;
