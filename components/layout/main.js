import React from 'react';
import styled from 'styled-components';

const StyledMain = styled.div`
	margin-left: 5px;
	margin-right: 5px;

	@media (min-width: 768px) {
		margin-top: 0;
		margin-left: 15em;
		margin-right: 1em;
	}

	p {
		margin: 0;
		padding-top: 20px;
	}
`;

const Main = ({children}) => <StyledMain>{children}</StyledMain>;

export default Main;
