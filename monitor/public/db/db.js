/**
 * 导入mssql模块
 * 
 * @type {[type]}
 */
var mssql = require('mssql');

var sql = {};

/**
 * 初始化的mssql配置参数
 * 
 * @type {Object}
 */
var config = {
	user: 'sa',
	password: '654321Bdldz',
	server: '10.45.10.139',
	/**
	 * 连接的数据库
	 * @type {String}
	 */
	database: 'obd',
	/**
	 * 如果是Windows Azure则应该设置encrypt=true
	 * 
	 * 
	 * @type {Object}
	 */
	/*opitions: {
		encrypt: true
	},*/
	pool:{
		min:0,
		idleTimeoutMillis:3000
	}
};

sql.sqlserver = mssql;
sql.connection = null
/**
 * sql参数的类型
 * @type {Object}
 */
sql.direction = {
	Input : "input",
	Output : "output",
	Return : "return"

};

/**
 * 初始化连接参数
 * @param  {[type]} user     [description]
 * @param  {[type]} password [description]
 * @param  {[type]} server   [description]
 * @param  {[type]} database [description]
 * @return {[type]}          [description]
 */
sql.initConfig = function(user, password, server, database) {
	config = {
		user: user,
		password: password,
		server: server,
		database: database,
		pool: {
			min: 0,
			idleTimeoutMillis: 3000
		}
	};

};

sql.initConnection = function(){
	if(!sql.connection){
		sql.connection = mssql.connect(config,function(err){
			if(err){
				console.log("open db connection failed.");
			}
			else{
				console.log("open db connection successed.");
			}
		});

		sql.connection.on("error",function(){
			console.log("db connection closed.");
			connection = null;
		});
	}
}


sql.initConnection();

/**
 * 执行sql带参数的查询
 * @param  {[type]} sqlText [description]
 * @param  {[type]} params  [description]
 * @param  {[type]} func    [description]
 * @return {[type]}         [description]
 */
sql.queryWithParams = function(sqlText,params,func){
	var request = new mssql.Request(sql.connection);
	request.multiple = true;

	if(params){
		for(var index in params){
			request.input(index,params[index],sqlType,params[index].inputValue);
		}
	}

	request.query(sqlText,func);
};

/**
 * 执行sql不带参数的查询
 * @param  {[type]} sqlText [description]
 * @param  {[type]} func    [description]
 * @return {[type]}         [description]
 */
sql.query = function(sqlText,func){
	sql.queryWithParams(sqlText,null,func);
};

/**
 * 导出db模块
 * 
 * @type {[type]}
 */
module.exports = sql;