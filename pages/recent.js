import fetch from "../lib/fetch";
import useSWR from "swr";

import Loader from "../components/loader";
import Page from "../components/layout/page";
import RecentTable from "../components/tables/recent-table";
import PageHeader from "../components/page-header";

const Recent = () => {
	const { data, error } = useSWR("/api/recent", fetch);
	if (error) return <div>Error!</div>;

	return (
		<Page title="Recent">
			<PageHeader text="Recent" />
			{data ? <RecentTable data={data} /> : <Loader />}
		</Page>
	);
};

export default Recent;
