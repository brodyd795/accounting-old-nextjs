const imaps = require('imap-simple');

const db = require('./db');

// require("dotenv").config();
require('dotenv').config({path: '../../.env'});

const config = {
	imap: {
		user: process.env.EMAIL,
		password: process.env.EMAIL_PASSWORD,
		host: 'imap.gmail.com',
		port: 993,
		tls: true,
		authTimeout: 3000
	}
};

async function processTransactions(transactions) {
	for (const transaction of transactions) {
		await processTransaction(transaction);
	}
}

const processTransaction = async transaction => {
	const accountBalances = await db.getLastAccountBalances(
		transaction.toAccount,
		transaction.fromAccount,
		transaction.id
	);

	transaction.toBalance = accountBalances.toAccount + transaction.amount;
	transaction.fromBalance = accountBalances.fromAccount - transaction.amount;
	transaction.userEmail = 'brodydingel@gmail.com';

	await db.insertTransaction(transaction);
};

const processEmails = async emails => {
	db.getLastId().then(lastId => {
		const transactions = [];

		const today = parseInt(
			new Date().toISOString().slice(0, 10).replace(/-/g, '').replace(/$/, '00')
		);

		(async function () {
			for (let i = 0; i < emails.length; i++) {
				const body = emails[i].parts[0].body;
				const id = today > lastId ? today + i : lastId + i + 1;
				const results = await parseEmail(body);

				transactions.push({id, ...results});

				if (transactions.length === emails.length) {
					processTransactions(transactions);
				}
			}
		})();
	});
};

const parseEmail = async body => {
	let amount, toAccount, fromAccount, comment;
	const {
		fastFoodLocations,
		gasLocations,
		groceryLocations,
		rentAmount,
		carPaymentAmount,
		salaryAmount
	} = await db.getTransactionIdentifiers();

	if (body.includes('charged')) {
		// transactions on credit card
		amount_raw = /charged \$[\d,]+\.\d+ [^\.]+?\./.exec(body)[0];
		amount = /[\d,]+\.\d+/.exec(amount_raw)[0];
		amount = parseFloat(amount);

		fromAccount = 'L_Credit_Card';

		let location = /at [^\.]+?\./.exec(amount_raw)[0];

		location = location.replace(/at |\./g, '');
		comment = location;

		// check if the location contains a substring of a location type (e.g., "McDonalds", "Hy-Vee")
		if (
			fastFoodLocations.some(fastFoodLocation =>
				location.includes(fastFoodLocation)
			)
		) {
			toAccount = 'E_Fast_Food';
		} else if (
			gasLocations.some(gasLocation => location.includes(gasLocation))
		) {
			toAccount = 'E_Gas';
		} else if (
			groceryLocations.some(groceryLocation =>
				location.includes(groceryLocation)
			)
		) {
			toAccount = 'E_Groceries';
		} else {
			toAccount = 'E_Other';
		}
	} else if (body.includes('Your transaction of')) {
		// withdrawals from checking account
		amount_raw = /transaction\s+of\s+\$[\d,]+\.\d+[^\.]+?\./.exec(body)[0];
		amount = /[\d,]+\.\d+/.exec(amount_raw)[0];
		amount = parseFloat(amount);

		if (amount === parseFloat(rentAmount)) {
			fromAccount = 'A_US_Bank';
			toAccount = 'E_Bills';
			comment = 'Rent';
		} else if (amount === parseFloat(carPaymentAmount)) {
			fromAccount = 'A_US_Bank';
			toAccount = 'E_Bills';
			comment = 'Car payment';
		} else if (amount > 100) {
			fromAccount = 'A_US_Bank';
			toAccount = 'L_Credit_Card';
			comment = 'Pay off credit card';
		} else {
			fromAccount = 'A_US_Bank';
			toAccount = 'E_Other';
			comment = 'Other';
		}
	} else if (body.includes('Deposit')) {
		// 	deposits to checking account
		amount_raw = /Deposit\s+of\s+\$[\d,]+\.\d+/.exec(body)[0];
		amount = /[\d,]+\.\d+/.exec(amount_raw)[0];
		amount = parseFloat(amount);

		if (amount > parseFloat(salaryAmount)) {
			fromAccount = 'I_Hy-Vee';
			comment = 'Salary from Hy-Vee';
		} else {
			fromAccount = 'I_Other';
			comment = 'Other income';
		}

		toAccount = 'A_US_Bank';
	}

	return {
		toAccount,
		fromAccount,
		amount,
		comment
	};
};

imaps.connect(config).then(connection => {
	return connection.openBox('INBOX').then(() => {
		const searchCriteria = ['UNSEEN', ['FROM', process.env.BANK_EMAIL]];

		const fetchOptions = {
			bodies: ['HEADER', 'TEXT'],
			markSeen: false // true in prod
		};

		return connection.search(searchCriteria, fetchOptions).then(emails => {
			if (emails.length > 0) processEmails(emails);
			connection.imap.closeBox(true, err => {
				if (err) {
					console.log(err);
				}
			});
			connection.end();
		});
	});
});
