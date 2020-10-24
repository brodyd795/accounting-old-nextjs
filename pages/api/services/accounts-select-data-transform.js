export default accounts => {
	const options = [
		{
			label: 'Income',
			options: []
		},
		{
			label: 'Expenses',
			options: []
		},
		{
			label: 'Assets',
			options: []
		},
		{
			label: 'Liabilities',
			options: []
		},
		{
			label: 'Virtual Savings',
			options: []
		},
		{
			label: 'Net Worth',
			options: []
		}
	];

	accounts.map(account => {
		const account_ui = account.slice(2).replace(/_/g, ' ');

		const optionToAdd = {
			label: account_ui,
			value: account
		};

		switch (account[0]) {
			case 'I':
				options[0].options.push(optionToAdd);

				break;
			case 'E':
				options[1].options.push(optionToAdd);

				break;
			case 'A':
				options[2].options.push(optionToAdd);

				break;
			case 'L':
				options[3].options.push(optionToAdd);

				break;
			case 'V':
				options[4].options.push(optionToAdd);

				break;
			case 'F':
				options[5].options.push(optionToAdd);
		}
	});

	return options;
};
