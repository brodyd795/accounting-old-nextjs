import styled from "styled-components";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StyledLinkDiv = styled.div`
	cursor: pointer;
	padding: 10px 5px;
	display: flex;
	justify-content: center;
	align-items: flex-end;

	:hover {
		background-color: #222;
	}
`;

const iconStyle = {
	width: "25px",
	height: "25px",
};

const textStyle = {
	paddingLeft: "10px",
	fontSize: "20px",
};

const NavLink = ({ path, icon, text }) => {
	const router = useRouter();
	return (
		<StyledLinkDiv className={router.pathname === path && "active"}>
			<FontAwesomeIcon icon={icon} style={iconStyle} />
			<span style={textStyle}>{text}</span>
		</StyledLinkDiv>
	);
};

export default NavLink;
