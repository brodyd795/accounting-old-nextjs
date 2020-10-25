import Link from 'next/link';
import styled from 'styled-components';

const StyledLoginWrapper = styled.div`
	width: 20em;
	height: 60px;
`;

const StyledLoginButton = styled.button`
	background-color: #222;
	border: none;
	width: 100%;
	height: 100%;
	color: white;
	padding: 0;
	cursor: pointer;
	border: 1px solid black;
	border-radius: 10px;
	font-size: 20px;
`;

const StyledGuestMessageWrapper = styled.div`
	display: flex;
	justify-content: center;
`;

const LoginView = () => {
	return (
		<StyledLoginWrapper>
			<Link href='/api/auth/login'>
				<StyledLoginButton>Login</StyledLoginButton>
			</Link>
			<StyledGuestMessageWrapper>
				<p>{'(Visitors will view demo data)'}</p>
			</StyledGuestMessageWrapper>
		</StyledLoginWrapper>
	);
};

export default LoginView;
