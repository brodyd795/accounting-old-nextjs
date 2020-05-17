import styled from "styled-components";

const StyledMain = styled.div`
	position: relative;
	margin-left: 14em;
	border: 2px solid red;
	height: 100%;

	@media (max-width: 768px) {
		margin-left: 0;
	}
`;

const StyledOpenToggler = styled.button`
	@media (min-width: 769px) {
		display: none;
	}
`;

const Main = ({ setOpen }) => (
	<StyledMain>
		<div>
			<input type="text" placeholder="Search" />
			<StyledOpenToggler
				onClick={() => {
					setOpen(true);
				}}>
				Open Toggle
			</StyledOpenToggler>
		</div>
	</StyledMain>
);

export default Main;
