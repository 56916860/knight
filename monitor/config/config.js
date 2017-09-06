const config = {
	mssql_config: {
		user: 'sa',
		server:'*.*.*.*',
		password: '654321Bdldz',
		/**
		 * 连接的数据库
		 * @type {String}
		 */
		database: 'obd',
		opitions: {
			encrypt: true
		}
	}
};

module.exports = config;