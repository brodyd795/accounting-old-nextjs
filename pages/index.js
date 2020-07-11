import fetch from "../libs/fetch";
import useSWR from "swr";

import Loader from "../components/loader";
import Page from "../components/layout/page";
import SummaryTable from "../components/tables/summary-table";
import PageHeader from "../components/page-header";
import Error from '../components/error'

const Index = () => {
	const { data, error } = useSWR("/api", fetch);
	if (error) return <Error />;

	return (
		<Page title="Home">
			<PageHeader text="Home" />
			{data ? <SummaryTable data={data} /> : <Loader />}
		</Page>
	);
};

export default Index;
