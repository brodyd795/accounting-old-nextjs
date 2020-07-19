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

	const [amount, setAmount] = useState("");

	const formatNumber = (n) => {
		return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	const formatCurrency = (input, blur) => {
		let input_val = input.target.value;

		if (input_val === "") {
			return;
		}

		if (input_val.indexOf(".") >= 0) {
			let decimal_pos = input_val.indexOf(".");

			let left_side = input_val.substring(0, decimal_pos);
			let right_side = input_val.substring(decimal_pos);

			left_side = formatNumber(left_side);
			right_side = formatNumber(right_side);

			if (blur) {
				right_side += "00";
			}

			right_side = right_side.substring(0, 2);

			input_val = "$" + left_side + "." + right_side;
		} else {
			input_val = formatNumber(input_val);
			input_val = "$" + input_val;

			if (blur) {
				input_val += ".00";
			}
		}

		setAmount(input_val);
	};

	const handleFromAmountChange = (e) => {
		formatCurrency(e);
	};

	const handleFromAmountBlur = (e) => {
		formatCurrency(e, true);
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
					<label>From:</label>
					<input
						type="text"
						name="currency-field"
						id="currency-field"
						pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
						value={amount}
						data-type="currency"
						placeholder="$0"
						onChange={handleFromAmountChange}
						onBlur={handleFromAmountBlur}
					/>
				</>
			) : (
				<Loader />
			)}
		</Page>
	);
};

export default Search;
