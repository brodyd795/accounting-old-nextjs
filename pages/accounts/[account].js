import fetch from "../../libs/fetch";
import useSWR from "swr";

import Loader from "../../components/loader";
import Page from "../../components/layout/page";
import PageHeader from "../../components/page-header";
import { useRouter } from "next/router";
import RecentTable from "../../components/tables/recent-table";

const Account = () => {
	const router = useRouter();
	const { account } = router.query;
	const accountName = account.slice(2).replace(/_/g, " ");

	const { data, error } = useSWR(`/api/accounts/${account}`, fetch);
	if (error) return <div>Error!</div>;

	return (
		<Page title="Home">
			<PageHeader text={accountName} />
			{!data ? (
				<Loader />
			) : data.length > 0 ? (
				<RecentTable data={data} />
			) : (
				<span>
					Sorry, it looks like the account <strong>{account}</strong> doesn't
					exist.
				</span>
			)}
		</Page>
	);
};

export default Account;
