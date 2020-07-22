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
	const { data, error } = useSWR("/api", fetch);
	if (error) return <Error />;

	const adminEmails = process.env.ADMIN_EMAILS.split(" ");

	return (
		<Page title="Home">
			<PageHeader text="Home" />
			{loading || !data ? (
				<Loader />
			) : user && adminEmails.includes(user.email) ? (
				<SummaryTable data={data} />
			) : (
				<p>No user</p>
			)}
		</Page>
	);
};

export default Index;
