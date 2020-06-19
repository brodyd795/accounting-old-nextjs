// import fetch from "../../libs/fetch";
import fetch from "isomorphic-unfetch";
import { useRouter } from "next/router";
import useSWR from "swr";

import Loader from "../../components/loader";
import Page from "../../components/layout/page";
import PageHeader from "../../components/page-header";
import RecentTable from "../../components/tables/recent-table";

const fetcher = async (url) => {
	const res = await fetch(url);
	const data = await res.json();
	console.log(data);
	if (res.status !== 200) {
		throw new Error(data.message);
	}
	return data;
};

const Account = () => {
	// const router = useRouter();
	// const { account } = router.query;
	// const accountName = account.slice(2).replace(/_/g, " ");

	// const { data, error } = useSWR(`/api/accounts/${account}`, fetch);
	// if (error) return <div>Error!</div>;

	const { query } = useRouter();
	const { data, error } = useSWR(
		() => query.id && `/api/accounts/${query.id}`,
		fetcher
	);
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
