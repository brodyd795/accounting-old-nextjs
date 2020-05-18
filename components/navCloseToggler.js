import styled from "styled-components";

const StyledNavCloseToggler = styled.div`
	text-align: right;
	font-size: 30px;
	margin: 10px;
	cursor: pointer;

	:hover {
		color: blue;
	}

	@media (min-width: 769px) {
		display: none;
	}
`;

const NavCloseToggler = ({ setOpen }) => (
	<StyledNavCloseToggler
		onClick={() => {
			setOpen(false);
		}}>
		X
	</StyledNavCloseToggler>
);

export default NavCloseToggler;
