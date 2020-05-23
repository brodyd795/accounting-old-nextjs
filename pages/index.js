import useSWR from "swr";

import Page from "../components/layout/page";

const Index = () => {
	const { data } = useSWR("/api", fetch);
	// if (error) return <div>Error!</div>;
	// if (!data) return <div>...loading</div>;
	console.log(data);
	return (
		<Page title="Home">
			<p>Home</p>
			{data ? <p>{JSON.stringify(data)}</p> : <p>Loading...</p>}
		</Page>
	);
	// return <div>hello! {JSON.stringify(data)}</div>;
	// return (
	// 	<Page title={"Home"}>
	// 		<p>Home</p>
	// 	</Page>
};
// Index.getInitialProps = async ({ req }) => {
// 	const res = await fetch("http://localhost:3000/api");
// 	const data = await res.json();
// 	return { data: data };
// };

export default Index;
