import { createConn } from "./create-connection-repository";
import { deleteTransaction } from "./delete-repository";
import { getLastAccountBalances } from "./get-last-account-balances-repository";
import { getLastId } from "./get-last-id-repository";
import { insertTransaction } from "./insert-repository";

export const editTransaction = async (originalRow, editedRow) => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");
		await deleteTransaction(originalRow);

		const lastBalances = await getLastAccountBalances(
			originalRow.to_account,
			originalRow.from_account,
			originalRow.trn_id
		);

		const amount = parseFloat(editedRow.amount);
		const toBalance = parseFloat(lastBalances.toAccount) + parseFloat(amount);
		const fromBalance =
			parseFloat(lastBalances.fromAccount) - parseFloat(amount);

		let id = parseInt(
			// TODO: uncomment once UI has date format like it used to - 2020-08-29
			// editedRow.trn_id.toString().replace(/-/g, "").concat("00")
			editedRow.trn_id.toString()
		);

		if (id / 100 !== parseInt(originalRow.trn_id / 100)) {
			id = await getLastId(id);
		} else {
			id = originalRow.trn_id;
		}
		await insertTransaction({
			id,
			userEmail: "brodydingel@gmail.com",
			toAccount: editedRow.to_account,
			fromAccount: editedRow.from_account,
			amount,
			toBalance,
			fromBalance,
			comment: editedRow.comment,
		});
		await conn.query("COMMIT");

		return "OK";
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
};
