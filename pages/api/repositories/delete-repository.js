import { createConn } from "./create-connection-repository";
import { transactionWrapper } from "./transaction-wrapper-repository";

export const deleteTransaction = async (row) => {
	const deleteIt = async () => {
		const conn = await createConn();
		const { trn_id, amount, from_account, to_account } = row;
		await conn.query(`delete from transactions where trn_id = ?`, [trn_id]);
		await conn.query(
			"UPDATE transactions SET to_balance = to_balance - ? WHERE trn_id > ? AND (to_account = ? OR to_account = ?)",
			[amount, trn_id, to_account, from_account]
		);
		await conn.query(
			`UPDATE transactions SET from_balance = from_balance + ? WHERE trn_id > ? AND (from_account = ? OR from_account = ?)`,
			[amount, trn_id, to_account, from_account]
		);
	};

	const wrapped = transactionWrapper(deleteIt);
	const result = await wrapped();
	console.log("result", result);
};
