import fetch from "../lib/fetch";
import useSWR from "swr";
import { useFetchUser } from "../lib/user";

import Loader from "../components/loader";
import Page from "../components/layout/page";
import SummaryTable from "../components/tables/summary-table";
import PageHeader from "../components/page-header";

const Index = () => {
	const { user, loading } = useFetchUser();
	const { data, error } = useSWR("/api", fetch);
	if (error) return <div>Error!</div>;

	return (
		<Page title="Home">
			<PageHeader text="Home" />
			{loading || !data ? (
				<Loader />
			) : user ? (
				<SummaryTable data={data} />
			) : (
				<p>No user</p>
			)}
		</Page>
	);
};

export default Index;
