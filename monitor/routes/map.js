var express = require('express');
var router = express.Router();
var config = require('../config/config');
var db = require('../public/db/db.js');
/* GET map home page. */
router.get('/', function(req, res, next) {
	//设置response编码为utf-8
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    //执行接口查询
	db.query('select top 1 * from Vehicle_Route',function(err,result){
		if(err){
			return res.end(JSON.stringify(err));
		}
		return res.end(JSON.stringify(arguments));
	});
});

/**
 * 获取设备的实时位置
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {}          [description]
 * @return {[type]}       [description]
 */
router.get('/locations', function(req, res, next) {
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    return res.end('返回实时位置');
});


/**
 * 返回热力地图
 */
router.get('/heat.page', function(req, res, next) {
	res.render('heat');
});

/**
 * 返回热点实时文职
 * rl.device_code,
 */
router.get('/heat_locations', function(req, res, next) {
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    

	db.query("SELECT rl.latitude AS lat,rl.longitude AS lng FROM Realtime_Location rl JOIN "
			+" (SELECT device_code FROM Realtime_Location_OBD where device_type = 1 and started = 1) AS dc "
			+" ON rl.device_code = dc.device_code "
			+" where rl.gps_time > '2017-09-04'",function(err,result){
		if(err){
			return res.end(JSON.stringify(err));
		}
		return res.end(JSON.stringify(arguments[1].recordsets[0]));
	});
});


/**
 * 获取前十个行程
 * @param  {[type]} req      [description]
 * @param  {[type]} res      [description]
 * @param  {[type]} next){	                 res.writeHead(200,{'Content-Type':'text/html;charset [description]
 * @return {[type]}          [description]
 */
router.get('/routes', function(req,res,next){
	//设置response编码为utf-8
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    //执行接口查询
	db.query('select top 10 * from Vehicle_Route order by id desc',function(err,result){
		if(err){
			return res.end(JSON.stringify(err));
		}
		return res.end(JSON.stringify(arguments[1].recordsets[0]));
	});
});
module.exports = router;