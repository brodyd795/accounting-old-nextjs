import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";

import NavCloseToggler from "./navCloseToggler";
import HomeIcon from "../../static/svgs/home.svg";
import SearchIcon from "../../static/svgs/search.svg";

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

	svg {
		height: 25px;
		width: 25px;
	}
`;

const StyledLinksList = styled.ul`
	margin-top: 100px;
	padding-left: 10px;

	li {
		list-style-type: none;
	}
`;

const StyledLinkItem = styled.li`
	cursor: pointer;
	padding: 10px 5px;
	display: flex;
	justify-content: center;
	align-items: flex-end;

	:hover {
		background-color: #222;
	}
`;

const StyledLinkText = styled.span`
	padding-left: 10px;
	font-size: 20px;
`;

const StyledBrand = styled.div`
	font-size: 30px;
	margin-top: 1em;
	:hover {
		cursor: pointer;
	}
`;

const Navbar = ({ open, setOpen }) => {
	const router = useRouter();
	return (
		<StyledNavbar id="nav" open={open}>
			<NavCloseToggler setOpen={setOpen} />
			<Link href="/">
				<StyledBrand>Accounting</StyledBrand>
			</Link>
			<StyledLinksList>
				<Link href="/">
					<StyledLinkItem className={router.pathname === "/" && "active"}>
						<HomeIcon />
						<StyledLinkText>{"Home"}</StyledLinkText>
					</StyledLinkItem>
				</Link>
				<Link href="/search">
					<StyledLinkItem className={router.pathname === "/search" && "active"}>
						<SearchIcon />
						<StyledLinkText>{"Search"}</StyledLinkText>
					</StyledLinkItem>
				</Link>
			</StyledLinksList>
		</StyledNavbar>
	);
};

export default Navbar;
