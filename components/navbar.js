import React, { useEffect } from "react";

import Link from "next/link";
import styled from "styled-components";

const StyledNavbar = styled.nav`
	margin: 0;
	height: 100%;
	width: 14em;
	position: fixed;
	overflow: auto;
	background-color: gray;

	@media (max-width: 768px) {
		width: ${(props) => (props.open === true ? "100%" : "0")};
		z-index: 1;
		overflow-x: hidden;
		text-align: center;
		border: none;
		transition: 0.3s;
	}

	a {
		display: block;
	}

	a:hover {
		color: blue;
	}
`;

const StyledCloseToggler = styled.button`
	@media (min-width: 769px) {
		display: none;
	}
`;

const Navbar = ({ open, setOpen }) => {
	return (
		<StyledNavbar id="nav" open={open}>
			<h1>Accounting</h1>
			<Link href="#">
				<a>Link 1</a>
			</Link>

			<Link href="#">
				<a>Link 2</a>
			</Link>
			<StyledCloseToggler
				onClick={() => {
					setOpen(false);
				}}>
				Exit Toggle
			</StyledCloseToggler>
		</StyledNavbar>
	);
};

export default Navbar;
