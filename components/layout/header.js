import styled from "styled-components";
import Welcome from "./welcome";
import Bars from "../../static/svgs/bars.svg";

const StyledHeader = styled.div`
	position: relative;
	margin-left: 14em;
	padding-top: 20px;

	@media (max-width: 768px) {
		margin-left: 0;
	}

	a.icon {
		background: red;
		display: block;
	}
`;

const navbarTogglerStyle = {
	width: "20px",
	margin: "5px",
	cursor: "pointer",
};

const StyledInputWrapper = styled.div`
	margin: 5px;
	@media (max-width: 768px) {
		display: none;
	}
	display: flex;
	justify-content: flex-end;
`;

const StyledInput = styled.input`
	font-size: 15px;
`;

const IconWrapper = styled.div`
	@media (min-width: 769px) {
		display: none;
	}
	display: inline;
	padding-left: 5px;
`;

const Header = ({ setOpen, children }) => (
	<StyledHeader>
		<div>
			<IconWrapper>
				<Bars
					style={navbarTogglerStyle}
					onClick={() => {
						setOpen(true);
					}}
					className="noSelect"
				/>
			</IconWrapper>
			<StyledInputWrapper>
				<StyledInput placeholder="Search..." />
			</StyledInputWrapper>
			<Welcome />
			{children}
		</div>
	</StyledHeader>
);

export default Header;
