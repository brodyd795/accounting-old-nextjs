import fetch from "../../libs/fetch";
import { useRouter } from "next/router";
import useSWR from "swr";

import Loader from "../../components/loader";
import Page from "../../components/layout/page";
import PageHeader from "../../components/page-header";
import RecentTable from "../../components/tables/recent-table";

const Account = () => {
	const { query } = useRouter();
	const { data, error } = useSWR(`/api/accounts/${query.id}`, fetch);
	if (error) return <div>{error.message}</div>;

	return (
		<Page title="Home">
			<p>Hello</p>
			<PageHeader text={query.id} />
			{!data ? <Loader /> : <p>{JSON.stringify(data)}</p>}
		</Page>
	);
};

export default Account;
