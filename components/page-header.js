import styled from "styled-components";

const StyledH2 = styled.h2`
	color: #222;
`;

const PageHeader = ({ text }) => <StyledH2>{text}</StyledH2>;

export default PageHeader;
