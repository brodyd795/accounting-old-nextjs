import {withTransactionWrapper, conn} from './transaction-wrapper-repository';

export const getTransactionIdentifiers = async () => {
	const rows = await conn.query(`SELECT * FROM transaction_identifiers`);

	const identifiers = {
		fastFoodLocations: [],
		gasLocations: [],
		groceryLocations: [],
		rentAmount: null,
		carPaymentAmount: null,
		salaryAmount: null
	};

	rows.map(row => {
		const {trn_type, trn_identifier} = row;

		switch (trn_type) {
			case 'restaurant':
				identifiers.fastFoodLocations.push(trn_identifier);

				break;
			case 'gas':
				identifiers.gasLocations.push(trn_identifier);

				break;
			case 'grocery':
				identifiers.groceryLocations.push(trn_identifier);

				break;
			case 'rent':
				identifiers.rentAmount = trn_identifier;

				break;
			case 'carPayment':
				identifiers.carPaymentAmount = trn_identifier;

				break;
			case 'salary':
				identifiers.salaryAmount = trn_identifier;

				break;
		}
	});

	return identifiers;
};

export const wrappedGetTransactionIdentifiers = async props =>
	withTransactionWrapper(getTransactionIdentifiers, props);
