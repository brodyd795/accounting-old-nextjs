import Page from "../components/page";
import styled from "styled-components";

const StyledDiv = styled.div`
	@media (min-width: 768px) {
		margin-left: 14em;
		margin-top: 0;
	}
	p {
		margin: 0;
		padding-top: 20px;
	}
`;

const Index = () => (
	<Page title={"Search"}>
		<StyledDiv>
			<p>Search</p>
		</StyledDiv>
	</Page>
);

export default Index;
