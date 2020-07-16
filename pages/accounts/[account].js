import fetch from "../../lib/fetch";
import useSWR from "swr";
import withAuth from "../../components/with-auth";

import Loader from "../../components/loader";
import Page from "../../components/layout/page";
import PageHeader from "../../components/page-header";
import RecentTable from "../../components/tables/recent-table";

const Account = () => {
	const account =
		typeof window !== "undefined"
			? window.location.pathname.replace(/\/accounts\//, "")
			: "";
	console.log("account: ", account);
	const { data, error } = useSWR(`/api/accounts?account=${account}`, fetch);
	if (error) return <div>{error.message}</div>;

	return (
		<Page title={account}>
			<PageHeader text={account} />
			{!data ? <Loader /> : <RecentTable data={data} />}
		</Page>
	);
};

export default withAuth(Account);
