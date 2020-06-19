import styled from "styled-components";

const StyledWelcome = styled.div`
	background-color: white;

	h2 {
		padding: 1em;
		color: #222;
	}
`;

const Welcome = () => {
	const today = new Date();
	const utcHour = today.getUTCHours();
	const localHour = utcHour >= 5 ? utcHour - 5 : utcHour - 5 + 24;
	const greeting =
		localHour < 12
			? "Good morning, Brody & Rachel"
			: localHour < 18
			? "Good afternoon, Brody & Rachel"
			: "Good evening, Brody & Rachel";

	return (
		<StyledWelcome>
			<h2>{'hello4'}</h2>
		</StyledWelcome>
	);
};

export default Welcome;
