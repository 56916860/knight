const config = {
	mssql_config: {
		user: 'sa',
		/*password: '654321Bdldz',
		server: '10.45.10.139',*/
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