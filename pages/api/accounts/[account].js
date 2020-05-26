// const db = require("../db");

// export default ({ query: { account } }, res) => {
// 	db.getAccountTransactions(account).then((results) => {
// 		if (results.length > 0) {
// 			res.json(results);
// 		} else {
// 			res.json({ message: `Results for account ${account} not found` });
// 		}
// 	});
// };

// const db = require("../../../lib/accounting-sql/db");
export default ({ query: { id } }, res) => {
	//   db.getAccountTransactions(id).then(results => {
	//     if (results.length > 0) {
	//       res.status(200).json(results);
	//     } else {
	//       res.status(404).json({ message: `Results with id ${id} not found` });
	//     }
	//   });
	console.log(id);
	res.json({ message: "Good!" });
};
