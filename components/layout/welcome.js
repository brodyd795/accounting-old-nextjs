import React from 'react';
import styled from 'styled-components';

const StyledWelcome = styled.div`
	background-color: white;

	h2 {
		padding: 1em;
		color: #222;
	}
`;

const Welcome = ({user}) => {
	const today = new Date();
	const utcHour = today.getUTCHours();
	const localHour = utcHour >= 5 ? utcHour - 5 : utcHour - 5 + 24;
	const userName = user?.given_name;
	const timeOfDay =
		localHour < 12
			? 'Good morning'
			: localHour < 18
			? 'Good afternoon'
			: 'Good evening';
	const greeting = `${timeOfDay}${userName ? `, ${userName}` : ''}!`;

	return (
		<StyledWelcome>
			<h2>{greeting}</h2>
		</StyledWelcome>
	);
};

export default Welcome;
