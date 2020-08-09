import fetch from "../lib/fetch";
import useSWR from "swr";
import { useFetchUser } from "../lib/user";

import Loader from "../components/loader";
import Page from "../components/layout/page";
import SummaryTable from "../components/tables/summary-table";
import PageHeader from "../components/page-header";
import Error from "../components/error";

const Index = () => {
	const { user, loading } = useFetchUser();
	const { data, error } = useSWR(() => `/api?user=${user.email}`, fetch);
	if (error) return <Error />;

	return (
		<Page title="Home" loading={loading} user={user}>
			<PageHeader text="Home" />
			{loading && <Loader />}
			{!loading && !user && "Must login to continue"}
			{user && !data && <Loader />}
			{user && data && <SummaryTable data={data} />}
		</Page>
	);
};

export default Index;
