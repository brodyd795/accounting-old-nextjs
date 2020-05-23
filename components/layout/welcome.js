import styled from "styled-components";

const StyledWelcome = styled.div`
	background-color: white;

	h2 {
		padding: 1em;
		color: #222;
	}
`;

const Welcome = () => {
	let today = new Date();
	let curHr = today.getHours();

	let timeOfDay;
	if (curHr < 12) {
		timeOfDay = "Good morning, Brody & Rachel";
	} else if (curHr < 18) {
		timeOfDay = "Good afternoon, Brody & Rachel";
	} else {
		timeOfDay = "Good evening, Brody & Rachel";
	}

	return (
		<StyledWelcome>
			<h2>{timeOfDay}</h2>
		</StyledWelcome>
	);
};

export default Welcome;
