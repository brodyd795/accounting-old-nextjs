import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

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
		// position: absolute;
		// right: 0;
		// top: 0;
	}
`;

const iconStyle = {
	width: "20px",
	margin: "5px",
	cursor: "pointer",
};

const inputStyle = {
	margin: "5px",
	float: "right",
};

const IconWrapper = styled.div`
	@media (min-width: 769px) {
		display: none;
	}
	display: inline;
`;

const Header = ({ setOpen, children }) => (
	<StyledHeader>
		<div>
			<IconWrapper>
				<FontAwesomeIcon
					icon={faBars}
					style={iconStyle}
					onClick={() => {
						setOpen(true);
					}}
				/>
			</IconWrapper>
			<input type="text" placeholder="Search" style={inputStyle} />
			{children}
		</div>
	</StyledHeader>
);

export default Header;
