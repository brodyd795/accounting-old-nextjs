import fetch from "../../lib/fetch";
import useSWR from "swr";
import withAuth from "../../components/with-auth";
import styled from "styled-components";

import { useFetchUser } from "../../lib/user";

import Loader from "../../components/loader";
import Page from "../../components/layout/page";
import RecentTable from "../../components/tables/recent-table";
import PageHeader from "../../components/page-header";
import Error from "../../components/error";

const TableWrapper = styled.div`
	overflow-x: scroll;
`;

const Recent = () => {
	const { user, loading } = useFetchUser();
	const { data, error } = useSWR(
		user ? `/api/transactions/recent?user=${user.email}` : null,
		fetch
	);
	if (error) return <Error />;

	return (
		<Page title="Recent">
			<PageHeader text="Recent" />
			{loading && <Loader />}
			{!loading && !user && <p>No user</p>}
			{user && data && (
				<TableWrapper>
					<RecentTable data={data} />
				</TableWrapper>
			)}
		</Page>
	);
};

export default withAuth(Recent);
