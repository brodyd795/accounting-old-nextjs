import React from "react";
import Link from "next/link";
import styled from "styled-components";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import NavCloseToggler from "./navCloseToggler";
import NavLink from "./navLink";

const StyledNavbar = styled.nav`
	margin: 0;
	height: 100%;
	width: 14em;
	position: fixed;
	overflow: auto;
	background-color: #333;
	text-align: center;

	@media (max-width: 768px) {
		width: ${(props) => (props.open === true ? "100%" : "0")};
		z-index: 1;
		overflow-x: hidden;
		border: none;
		transition: 0.3s;
	}

	a {
		display: block;
	}

	a:hover {
		color: blue;
	}

	.active {
		background-color: gray;
	}
`;

const Navbar = ({ open, setOpen }) => {
	return (
		<StyledNavbar id="nav" open={open}>
			<NavCloseToggler setOpen={setOpen} />
			<h1>Accounting</h1>
			<Link href="/" as="/">
				<div>
					<NavLink path={"/"} icon={faHome} text="Home" />
				</div>
			</Link>
			<Link href="/search" as="/search">
				<div>
					<NavLink path={"/search"} icon={faSearch} text="Search" />
				</div>
			</Link>
		</StyledNavbar>
	);
};

export default Navbar;
