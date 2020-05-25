import styled from "styled-components";

const StyledLoader = styled.div`
	// adapted from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_loader
	text-align: center;
	border: 4px solid #f3f3f3;
	border-radius: 50%;
	border-top: 4px solid #3498db;
	width: 60px;
	height: 60px;
	-webkit-animation: spin 1s linear infinite; /* Safari */
	animation: spin 1s linear infinite;

	margin: auto;
	margin-top: 70px;

	/* Safari */
	@-webkit-keyframes spin {
		0% {
			-webkit-transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(360deg);
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

const Loader = () => <StyledLoader />;

export default Loader;
