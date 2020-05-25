const imaps = require("imap-simple");
const db = require("./db");
require("dotenv").config();
// require("dotenv").config({ path: "../../.env" });

let config = {
	imap: {
		user: process.env.EMAIL,
		password: process.env.EMAIL_PASSWORD,
		host: "imap.gmail.com",
		port: 993,
		tls: true,
		authTimeout: 3000,
	},
};

imaps.connect(config).then((connection) => {
	return connection.openBox("INBOX").then(() => {
		let searchCriteria = ["UNSEEN", ["FROM", process.env.BANK_EMAIL]];

		let fetchOptions = {
			bodies: ["HEADER", "TEXT"],
			markSeen: false, // true in prod
		};

		return connection.search(searchCriteria, fetchOptions).then((emails) => {
			if (emails.length > 0) processEmails(emails);
			connection.imap.closeBox(true, (err) => {
				if (err) {
					console.log(err);
				}
			});
			connection.end();
		});
	});
});

const processEmails = async (emails) => {
	db.getLastId().then((lastId) => {
		let transactions = [];

		const today = parseInt(
			new Date().toISOString().slice(0, 10).replace(/-/g, "").replace(/$/, "00")
		);

		(async function () {
			for (let i = 0; i < emails.length; i++) {
				let body = emails[i].parts[0].body;
				let id = today > lastId ? today + i : lastId + i + 1;
				let results = await parseEmail(body);
				transactions.push({ id, ...results });
				if (transactions.length === emails.length) {
					console.log(transactions);
					processTransactions(transactions);
				}
			}
		})();
	});
};

const parseEmail = async (body) => {
	let amount, debit, credit, comment;
	const {
		fastFoodLocations,
		gasLocations,
		groceriesLocations,
		rentAmount,
		carPaymentAmount,
		salaryAmount,
	} = await db.getTransactionIdentifiers();

	if (body.includes("charged")) {
		// transactions on credit card
		amount_raw = /charged \$[\d,]+\.\d+ [^\.]+?\./.exec(body)[0];
		amount = /[\d,]+\.\d+/.exec(amount_raw)[0];
		amount = parseFloat(amount);

		credit = "L_Credit_Card";

		let location = /at [^\.]+?\./.exec(amount_raw)[0];
		location = location.replace(/at |\./g, "");
		comment = location;

		// check if the location contains a substring of a location type (e.g., "McDonalds", "Hy-Vee")
		if (
			fastFoodLocations.some((fastFoodLocation) =>
				location.includes(fastFoodLocation)
			)
		) {
			debit = "E_Fast_Food";
		} else if (
			gasLocations.some((gasLocation) => location.includes(gasLocation))
		) {
			debit = "E_Gas";
		} else if (
			groceriesLocations.some((groceriesLocation) =>
				location.includes(groceriesLocation)
			)
		) {
			debit = "E_Groceries";
		} else {
			debit = "E_Other";
		}
	} else if (body.includes("Your transaction of")) {
		// withdrawals from checking account
		amount_raw = /transaction\s+of\s+\$[\d,]+\.\d+[^\.]+?\./.exec(body)[0];
		amount = /[\d,]+\.\d+/.exec(amount_raw)[0];
		amount = parseFloat(amount);

		if (amount === parseFloat(rentAmount)) {
			credit = "A_US_Bank";
			debit = "E_Bills";
			comment = "Rent";
		} else if (amount === parseFloat(carPaymentAmount)) {
			credit = "A_US_Bank";
			debit = "E_Bills";
			comment = "Car payment";
		} else if (amount > 100) {
			credit = "A_US_Bank";
			debit = "L_Credit_Card";
			comment = "Pay off credit card";
		} else {
			credit = "A_US_Bank";
			debit = "E_Other";
			comment = "Other";
		}
	} else if (body.includes("Deposit")) {
		// 	deposits to checking account
		amount_raw = /Deposit\s+of\s+\$[\d,]+\.\d+/.exec(body)[0];
		amount = /[\d,]+\.\d+/.exec(amount_raw)[0];
		amount = parseFloat(amount);
		if (amount > parseFloat(salaryAmount)) {
			credit = "I_Hy-Vee";
			comment = "Salary from Hy-Vee";
		} else {
			credit = "I_Other";
			comment = "Other income";
		}
		debit = "A_US_Bank";
	}

	return {
		debit: debit,
		credit: credit,
		amount: amount,
		comment: comment,
	};
};

const processTransaction = async (transaction) => {
	let accountBalances = await db.getLastAccountBalances(
		transaction.debit,
		transaction.credit,
		transaction.id
	);
	// console.log(transaction);
	// console.log(accountBalances);
	transaction.debit_balance = accountBalances.debit + transaction.amount;
	transaction.credit_balance = accountBalances.credit - transaction.amount;
	// console.log(transaction);
	await db.insertTransaction(transaction);
};

async function processTransactions(transactions) {
	for (let transaction of transactions) {
		await processTransaction(transaction);
	}
}
