import fetch from "../libs/fetch";
import useSWR from "swr";

import Loader from "../components/loader";
import Page from "../components/layout/page";
import RecentTable from "../components/tables/recent-table";
import PageHeader from "../components/page-header";

const Index = () => {
	const { data, error } = useSWR("/api", fetch);
	if (error) return <div>Error!</div>;

	return (
		<Page title="Home">
			<PageHeader text="Home" />
			{/* {JSON.stringify(data)} */}
			{data ? <RecentTable data={data} /> : <Loader />}
		</Page>
	);
};

export default Index;
