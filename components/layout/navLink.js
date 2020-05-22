import styled from "styled-components";
import { useRouter } from "next/router";

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

// const iconStyle = {
// 	width: "25px",
// 	height: "25px",
// };

const StyledIcon = styled(icon)`
	width: "25px",
	height: "25px",
`;

const textStyle = {
	paddingLeft: "10px",
	fontSize: "20px",
};

const NavLink = ({ path, text, icon }) => {
	const router = useRouter();
	return (
		<StyledLinkDiv className={router.pathname === path && "active"}>
			<StyledIcon icon={icon} />
			<span style={textStyle}>{text}</span>
		</StyledLinkDiv>
	);
};

export default NavLink;
