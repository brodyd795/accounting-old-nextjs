import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const StyledNavCloseToggler = styled.div`
	text-align: right;
	font-size: 30px;
	margin: 10px;
	cursor: pointer;

	:hover {
		color: gray;
	}

	@media (min-width: 769px) {
		display: none;
	}
`;

const iconStyle = {
	width: "25px",
	height: "25px",
};

const NavCloseToggler = ({ setOpen }) => (
	<StyledNavCloseToggler
		onClick={() => {
			setOpen(false);
		}}
		className="noSelect">
		<FontAwesomeIcon icon={faTimes} style={iconStyle} />
	</StyledNavCloseToggler>
);

export default NavCloseToggler;
