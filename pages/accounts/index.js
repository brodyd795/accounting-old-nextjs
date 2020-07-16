import fetch from "../../libs/fetch";
import useSWR from "swr";
import  Router  from 'next/router'

import Loader from "../../components/loader";
import Page from "../../components/layout/page";
import PageHeader from "../../components/page-header";
import Error from '../../components/error'
import AccountSelect from '../../components/filters/account-select'

const Accounts = () => {
	const { data, error } = useSWR("/api/accounts", fetch);
	if (error) return <Error />;

	const handleChange = (e) => {
		Router.push("/accounts/[account]", `/accounts/${e.value}`)
	}

	return (
		<Page title="Accounts">
			<PageHeader text="Accounts" />
			{data ? (
				<AccountSelect 
					options={data}
					placeholder="Select account..."
					onChange={handleChange}
				/>
			) : (
				<Loader />
			)}
		</Page>
	);
};

export default Accounts;
