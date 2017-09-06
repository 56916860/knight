var mysql = require('mysql');
var sql = {};
/**
 * MySql配置文件
 */
var config = {
    host: '192.168.1.8',
    user: 'root',
    password: 'root',
    database:'drds',
    port: 3306
};
/**
 * 数据库连接池部分
 */
var pool = mysql.createPool(config);

/**
 * Mysql查询
 */
sql.query = function(querystring,callback){
	/**
	 * 获取数据库连接池连接
	 */
	pool.getConnection(function(err,conn){
		/**
		 * 容错处理
		 */
		if(err) {
			console.log("mysql query open connect error :" , err);
			throw err;
		}
		/**
		 * 查询结果
		 */
		conn.query(querystring , function(err,rows,fields){
			if(err){
				console.log("mysql query error :",err);
				throw err;
			}
			/**
			 * 执行回调函数
			 */
			if(callback) callback(err,rows,fields);
		});

		conn.release();
	});
};

/**
 * Mysql插入
 */

sql.insert = function(insert_sql,callback){
	/**
	 * 容错处理
	 */
	var t1 = process.uptime();
	pool.getConnection(function(err,conn){
		if(err) {
			console.log("mysql query open connect error :" , err);
			throw err;
		}
		/**
		 * 插入
		 */
		conn.query(insert_sql,function(err,rows,fields){
			if(err){
				console.log("mysql query error :",err);
				throw err;
			}
			var t2 = process.uptime();
			/**
			 * 执行回调函数
			 */
			console.log("单次执行时间："+(t2-t1)*1000+",插入消耗时间: " + (process.uptime()-t1)*1000);
			if(callback) callback(err,rows,fields,(process.uptime()-t1)*1000);		
		});

		conn.release();
	});
};

/**
 * 创建表
 */
sql.create = function(create_sql,callback){
	pool.getConnection(function(err,conn){
		if(err) {
			console.log("mysql query open connect error :" , err);
			throw err;
		}

		/**
		 * 执行创建语句
		 */
		conn.query(create_sql,function(err,rows,fields){
			console.log("创建语句:" + create_sql);
			if(err){
				console.log("mysql query error :",err);
				throw err;
			}
			/**
			 * 创建回调
			 */
			if(callback) callback(err,rows);
		});
		/**
		 * 释放链接池
		 */
		conn.release();

	});
};

/**
 * 导出Mysql封装模块
 * 
 */
module.exports = sql;
