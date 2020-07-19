import fetch from "../libs/fetch";
import useSWR from "swr";
import { useState } from "react";

import Page from "../components/layout/page";
import PageHeader from "../components/page-header";
import AccountSelect from "../components/filters/account-select";
import Loader from "../components/loader";

const Search = () => {
	const { data, error } = useSWR("/api/accounts", fetch);
	const nullOption = { label: null, value: null };
	if (error) return <Error />;

	const [fromAccount, setFromAccount] = useState(nullOption);
	const [toAccount, setToAccount] = useState(nullOption);

	const handleFromAccountChange = (e) => {
		if (e === null) {
			setFromAccount(nullOption);
		} else if (toAccount === e) {
			alert("NO");
		} else {
			setFromAccount(e);
		}
	};

	const handleToAccountChange = (e) => {
		if (e === null) {
			setToAccount(nullOption);
		} else if (fromAccount === e) {
			alert("NO");
		} else {
			setToAccount(e);
		}
	};

	return (
		<Page title={"Search"}>
			<PageHeader text="Search" />
			{data ? (
				<>
					<label>From: </label>
					<AccountSelect
						options={data}
						placeholder="Choose account..."
						onChange={handleFromAccountChange}
						isClearable={true}
						value={fromAccount.value == null ? null : fromAccount}
					/>
					<label>To: </label>
					<AccountSelect
						options={data}
						value={toAccount.value === null ? null : toAccount}
						placeholder="Choose account..."
						onChange={handleToAccountChange}
						isClearable={true}
					/>
				</>
			) : (
				<Loader />
			)}
		</Page>
	);
};

export default Search;
