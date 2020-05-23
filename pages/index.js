import Page from "../components/layout/page";

const Index = () => (
	<Page title={"Home"}>
		<p>Home</p>
		<p>{`db user: ${process.env.db_user}`}</p>
	</Page>
);

export default Index;
