import fetch from "../libs/fetch";
import useSWR from "swr";
import { useState } from "react";

import Page from "../components/layout/page";
import PageHeader from "../components/page-header";
import AccountSelect from "../components/filters/account-select";
import Loader from "../components/loader";

const Search = () => {
	const { data, error } = useSWR("/api/accounts", fetch);
	if (error) return <Error />;

	const [fromAccount, setFromAccount] = useState("");
	const [toAccount, setToAccount] = useState("");

	const handleFromAccountChange = (e) => {
		if (toAccount === e.value) {
			alert("NO");
		} else {
			setFromAccount(e.value);
		}
	};

	const handleToAccountChange = (e) => {
		if (fromAccount === e.value) {
			alert("NO");
		} else {
			setToAccount(e.value);
		}
	};

	return (
		<Page title={"Search"}>
			<PageHeader text="Search" />
			{data ? (
				<>
					<label>From: {fromAccount}</label>
					<AccountSelect
						options={data}
						placeholder="Choose account..."
						onChange={handleFromAccountChange}
						isClearable={true}
					/>
					<label>To: {toAccount}</label>
					<AccountSelect
						options={data}
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
