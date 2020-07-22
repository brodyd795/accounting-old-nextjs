const transformAccountsListForDropdown = (accounts) => {
	const options = [
		{ label: "Income", options: [] },
		{ label: "Expenses", options: [] },
		{ label: "Assets", options: [] },
		{ label: "Liabilities", options: [] },
		{ label: "Virtual Savings", options: [] },
	];

	accounts.map((account) => {
		let account_ui = account.slice(2);
		switch (account[0]) {
			case "I":
				options[0].options.push({ label: account_ui, value: account });
				break;
			case "E":
				options[1].options.push({ label: account_ui, value: account });
				break;
			case "A":
				options[2].options.push({ label: account_ui, value: account });
				break;
			case "L":
				options[3].options.push({ label: account_ui, value: account });
				break;
			case "V":
				options[4].options.push({ label: account_ui, value: account });
				break;
		}
	});
	return options;
};

export default transformAccountsListForDropdown;
