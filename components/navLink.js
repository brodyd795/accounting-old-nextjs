import styled from "styled-components";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StyledLinkDiv = styled.div`
	cursor: pointer;

	:hover {
		background-color: gray;
	}
`;

const iconStyle = {
	width: "20px",
};

const textStyle = {
	paddingLeft: "5px",
};

const NavLink = ({ path, icon, text }) => {
	const router = useRouter();
	return (
		<StyledLinkDiv className={router.pathname === `path` && "active"}>
			<FontAwesomeIcon icon={icon} style={iconStyle} />
			<span style={textStyle}>{text}</span>
		</StyledLinkDiv>
	);
};

export default NavLink;
