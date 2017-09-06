var express = require('express');
var router = express.Router();

var mysql = require('../public/db/mysql_db.js')

/**
 * 返回用户首页
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {	mysql.query("select min(id) from realtime_location",function(err,result,fields){		if(err){			return res.end(JSON.stringify(err));		}		return res.end(JSON.stringify(result));	});} [description]
 * @return {[type]}       [description]
 */
router.get('/', function(req, res, next) {
	mysql.query("select min(id) from realtime_location",function(err,result,fields){
		if(err){
			return res.end(JSON.stringify(err));
		}
		return res.end(JSON.stringify(result));
	});
});


/**
 * 顺序插入
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {String} next) {	var        insert_val [description]
 * @return {[type]}       [description]
 */
router.get('/insert', function(req, res, next) {

	var insert_val = '';

	for(var loop =0 ; loop < 100;loop++){
		insert_val += ",(531512120001, 18, '2015-12-18 19:18:31', '22586103', '113884363', 1, 1, 1, 0, 0, 0,4,13,161253, '2015-12-18 19:18:35')";
	}

	var execute_time_array = new Array();

	//console.log(insert_val);
	
	var lp = 1;

	/*for(var t = 0 ; t < lp ; t++){
		mysql.insert('insert into t1(dc) values ' + '("123123123我")'+insert_val,function(err,result,fields,execute_time){
			execute_time_array.push(execute_time);

			if(execute_time_array.length == lp){
					console.log(execute_time_array);
					return res.end("finished execute");
			}
		});
	}*/

	insert_in_single(res,'INSERT INTO realtime_location_2(device_code,route_id,gps_time,latitude,longitude,is_location,n_s,e_w,gps_or_bsl,speed,direct,gps_number,gms_signal_quality,mileage,create_time) VALUES ' + "(531512120001, 18, '2015-12-18 19:18:31', '22586103', '113884363', 1, 1, 1, 0, 0,0,4, 13, 161253, '2015-12-18 19:18:35')"+insert_val,0,lp,0);
});



function insert_in_single(res,insert_val,current,total,et){
	mysql.insert(insert_val,function(err,result,fields,execute_time){
		console.log("执行"+current+",时间 :" + execute_time+",共耗时:" + (et+execute_time));
		if(current<total){
			insert_in_single(res,insert_val,current + 1,total,et+execute_time);
		}
		else{
			return res.end("execute finished");
		}
	});
}

/**
 * 不执行多线程并发插入
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {String} next) {	var        insert_val [description]
 * @return {[type]}       [description]
 */
router.get('/batch_insert', function(req, res, next) {

	var insert_val = '';

	for(var loop =0 ; loop < 10000;loop++){
		insert_val += ",(531512120001, 18, '2015-12-18 19:18:31', '22586103', '113884363', 1, 1, 1, 0, 0, 0, 4, 13, 161253, '2015-12-18 19:18:35')";
	}
	
	var execute_time_array = new Array();
	//console.log(insert_val);
	var lp = 2;

	for(var t = 0 ; t < lp ; t++){
		mysql.insert('INSERT INTO realtime_location_0(device_code,route_id,gps_time,latitude,longitude,is_location,n_s,e_w,gps_or_bsl,speed,direct,gps_number,gms_signal_quality,mileage,create_time) VALUES ' + "(531512120001, 18, '2015-12-18 19:18:31', '22586103', '113884363', 1, 1, 1, 0, 0,0,4, 13, 161253, '2015-12-18 19:18:35')"+insert_val,function(err,result,fields,execute_time){
			execute_time_array.push(execute_time);
			console.log("批量插入第"+ t +"次，执行时间:"+execute_time);
			if(execute_time_array.length == lp){
				var _total = 0;
				for(var eta in execute_time_array){
					_total += execute_time_array[eta];
				}

				console.log("并发执行时间"+_total/execute_time_array.length);
				return res.end("finished execute");
			}
		});
	}
});

/**
 * 创建表格
 * @param  {[type]} req       [description]
 * @param  {[type]} res       [description]
 * @param  {[type]} next){} [description]
 * @return {[type]}           [description]
 */
router.get('/create',function(req, res, next){

	for(var t=0; t< 100000;t++){
			mysql.create("CREATE TABLE `realtime_location_"+t.toString()+"` ("+
				  "`ID` bigint(20) NOT NULL AUTO_INCREMENT,"+
				  "`device_code` bigint(20) NOT NULL,"+
				  "`route_id` int(11) DEFAULT NULL,"+
				  "`gps_time` datetime DEFAULT NULL,"+
				  "`latitude` int(11) DEFAULT NULL,"+
				  "`longitude` int(11) DEFAULT NULL,"+
				  "`is_location` bit(1) DEFAULT NULL,"+
				  "`n_s` bit(1) DEFAULT NULL,"+
				  "`e_w` bit(1) DEFAULT NULL,"+
				  "`gps_or_bsl` bit(1) DEFAULT NULL,"+
				  "`speed` smallint(6) DEFAULT NULL,"+
				  "`direct` smallint(6) DEFAULT NULL,"+
				  "`gps_number` tinyint(4) DEFAULT NULL,"+
				  "`gms_signal_quality` tinyint(4) DEFAULT NULL,"+
				  "`mileage` int(11) DEFAULT NULL,"+
				  "`create_time` datetime DEFAULT NULL,"+
				  "PRIMARY KEY (`ID`)"+
				") ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8",function(err,rows,fields){
					console.log(err);
					console.log(rows);
					console.log(fields);
			
		});
	}
	return res.end("create ok");
});



module.exports = router;