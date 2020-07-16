import fetch from "../../lib/fetch";
import useSWR from "swr";
import Link from "next/link";
import withAuth from "../../components/with-auth";

import Loader from "../../components/loader";
import Page from "../../components/layout/page";
import RecentTable from "../../components/tables/recent-table";
import PageHeader from "../../components/page-header";

const Accounts = () => {
	const { data, error } = useSWR("/api/accounts", fetch);
	if (error) return <div>Error!</div>;

	return (
		<Page title="Accounts">
			<PageHeader text="Accounts" />
			{data ? (
				data.map((account) => (
					<Link href={"/accounts/[account]"} as={`/accounts/${account}`}>
						<p>{account}</p>
					</Link>
				))
			) : (
				<Loader />
			)}
		</Page>
	);
};

export default withAuth(Accounts);
