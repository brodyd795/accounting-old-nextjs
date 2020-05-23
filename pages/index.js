import fetch from "../libs/fetch";
import useSWR from "swr";
import Loader from "../components/loader";

import Page from "../components/layout/page";

const Index = () => {
	const { data, error } = useSWR("/api", fetch);
	if (error) return <div>Error!</div>;

	return (
		<Page title="Home">
			<p>Home</p>
			{data ? <p>{JSON.stringify(data)}</p> : <Loader />}
		</Page>
	);
};

export default Index;
