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

	.active {
		background-color: #222;
		border-left: 2px solid red;
	}

	#brand {
		font-size: 30px;
	}
`;

const StyledLinksList = styled.ul`
	margin-top: 100px;
	padding-left: 10px;

	li {
		list-style-type: none;
		padding: 0;
	}
`;

const StyledBrand = styled.div`
	font-size: 30px;
	margin-top: 1em;
`;

const Navbar = ({ open, setOpen }) => {
	return (
		<StyledNavbar id="nav" open={open}>
			<NavCloseToggler setOpen={setOpen} />
			<StyledBrand>
				<span>Accounting</span>
			</StyledBrand>
			<StyledLinksList>
				<Link href="/" as="/">
					<li className="navLinkWrapper">
						<NavLink path={"/"} icon={faHome} text="Home" />
					</li>
				</Link>
				<Link href="/search" as="/search">
					<li className="navLinkWrapper">
						<NavLink path={"/search"} icon={faSearch} text="Search" />
					</li>
				</Link>
			</StyledLinksList>
		</StyledNavbar>
	);
};

export default Navbar;
