import styled from "styled-components";
import Times from "../../public/svgs/times.svg";

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

	svg {
		width: 25px;
		height: 25px;
	}
`;

const NavCloseToggler = ({ setOpen }) => (
	<StyledNavCloseToggler
		onClick={() => {
			setOpen(false);
		}}
		className="noSelect">
		<Times />
	</StyledNavCloseToggler>
);

export default NavCloseToggler;
