const _ = require('lodash');
const Airtable = require('airtable');

const data = require('../scrape-data/work-at-startup');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
	process.env.AIRTABLE_BASE
);

const createRecords = (rows) => {
	const records = rows.map((d) => ({
		fields: d,
	}));

	return new Promise((res, rej) =>
		base('WorkAtStartup').create(records, function (err, records) {
			if (err) {
				rej(err);
				return;
			}
			res(records.length);
		})
	);
};

const main = async () => {
	let count = 0;
	try {
		for (let rows of _.chunk(data, 10)) {
			await createRecords(rows);
			console.log(count++);
		}
	} catch (error) {
		console.log(error);
	}
};

main();
module.exports = createRecords;
