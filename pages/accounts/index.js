import fetch from "../../libs/fetch";
import useSWR from "swr";
import Link from "next/link";

import Loader from "../../components/loader";
import Page from "../../components/layout/page";
import RecentTable from "../../components/tables/recent-table";
import PageHeader from "../../components/page-header";
import Error from '../../components/error'

const Accounts = () => {
	const { data, error } = useSWR("/api/accounts", fetch);
	if (error) return <Error />;

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

export default Accounts;
