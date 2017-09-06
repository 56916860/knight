var express = require('express');
var router = express.Router();
var config = require('../config/config');
var db = require('../public/db/db.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * 返回用户认证页首页
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {             res.render('users/licenses');} [description]
 * @return {[type]}       [description]
 */
router.get('/licenses.page', function(req, res, next) {
  res.render('users/licenses');
})
/**
 * 获取用户认证
 * @param  {[type]} req      [description]
 * @param  {[type]} res      [description]
 * @param  {[type]} next){	                 res.writeHead(200,{'Content-Type':'text/html;charset [description]
 * @return {[type]}          [description]
 */
router.get('/licenses', function(req, res, next){
	//设置response编码为utf-8
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    //执行接口查询
	db.query('select top 10 name,license_pic,submit_time from Driver_License where certified = 2 order by id desc',function(err,result){
		if(err){
			return res.end(JSON.stringify(err));
		}
		return res.end(JSON.stringify(arguments[1].recordsets[0]));
	});
});

/**
 * 获取认证用户图片照片个数
 * @param  {[type]} req                                                           [description]
 * @param  {[type]} res                                                           [description]
 * @param  {[type]} next){	res.writeHead(200,{'Content-Type':'text/html;charset [description]
 * @return {[type]}                                                               [description]
 */
router.get('/licenses_number',function(req,res,next){
	res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
	db.query('select count(0) from Driver_License',function(err,result){
		if(err){
			return res.end(JSON.stringify(err));
		}
		return res.end(JSON.stringify(arguments));
	});
});


/**
 * 获取用户基本信息
 */
router.get('/info',function(req,res,next){
	res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
	db.query("SELECT ouc.channelName,rlo.imei,rlo.imsi,rlo.device_code,vi.licensePlate,vi.device_bind_time,vi.drivingLicense,ui.name,ui.phone,ui.create_date,ui.last_login_date from Realtime_Location_OBD rlo LEFT JOIN Vehicle_Info vi on rlo.device_code = vi.device_code"
			+" LEFT JOIN User_Info ui on vi.userId = ui.id LEFT JOIN OBD_User_Channel ouc on rlo.channelId = ouc.id where rlo.device_code = "+ req.query.device_code ,function(err,result){
		if(err){
			return res.end(JSON.stringify(err));
		}
		return res.end(JSON.stringify(arguments[1].recordsets[0][0]));
	});
});

module.exports = router;
