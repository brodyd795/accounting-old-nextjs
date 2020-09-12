import { createConn } from "./create-connection-repository";

export const getTransactionIdentifiers = async () => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");
		const rows = await conn.query(`SELECT * FROM transaction_identifiers`);

		const identifiers = {
			fastFoodLocations: [],
			gasLocations: [],
			groceryLocations: [],
			rentAmount: null,
			carPaymentAmount: null,
			salaryAmount: null,
		};
		rows.map((row) => {
			const { trn_type, trn_identifier } = row;

			switch (trn_type) {
				case "restaurant":
					identifiers.fastFoodLocations.push(trn_identifier);
					break;
				case "gas":
					identifiers.gasLocations.push(trn_identifier);
					break;
				case "grocery":
					identifiers.groceryLocations.push(trn_identifier);
					break;
				case "rent":
					identifiers.rentAmount = trn_identifier;
					break;
				case "carPayment":
					identifiers.carPaymentAmount = trn_identifier;
					break;
				case "salary":
					identifiers.salaryAmount = trn_identifier;
					break;
			}
		});

		await conn.query("COMMIT");
		return identifiers;
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
};
