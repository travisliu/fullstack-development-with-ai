const path = require('path');

module.exports = {
	development: {
		dialect: 'sqlite',
		storage: path.resolve(__dirname, '../database.sqlite3')
	},
	test: {
		dialect: 'sqlite',
		storage: path.resolve(__dirname, '../database.test.sqlite3')
	},
	production: {
		dialect: 'sqlite',
		storage: path.resolve(__dirname, '../database.sqlite3')
	}
};

