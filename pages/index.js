import Page from "../components/layout/page";

const Index = (props) => (
	<Page title={"Home"}>
		<p>Home</p>
		<p>{JSON.stringify(props.data)}</p>
	</Page>
);

Index.getInitialProps = async ({ req }) => {
	const res = await fetch("http://localhost:3000/api");
	const data = await res.json();
	return { data: data };
};

export default Index;
