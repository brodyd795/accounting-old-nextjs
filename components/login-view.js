import Link from 'next/link';
import styled from 'styled-components';

const StyledLogin = styled.div`
	display: flex;
	width: 30%;
	justify-content: center;
	align-items: center;
	height: 60px;
	cursor: pointer;
	background-color: #222;
	border: 1px solid black;
	border-radius: 10px;
`;

const LoginView = () => {
	return (
		<Link href='/api/auth/login'>
			<>
				<StyledLogin>{'Log in to continue'}</StyledLogin>
				<p>{'(Guests will view demo data)'}</p>
			</>
		</Link>
	);
};

export default LoginView;
