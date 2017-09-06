var express = require('express');
var router = express.Router();
var config = require('../config/config');
var db = require('../public/db/db.js');


router.get('/con_err.page', function(req, res, next) {
	//设置response编码为utf-8
   // res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    //执行接口查询
	/*db.query('select top 1 * from Vehicle_Route',function(err,result){
		if(err){
			return res.end(JSON.stringify(err));
		}
		return res.end(JSON.stringify(arguments));
	});*/
	//return res.end("3213123");
	res.render('con_err');
});

/**
 * 接错线的设备：2017-06-01 没有任何熄火事件上报
 */
router.get('/con_err', function(req,res,next){
	res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
	db.query("SELECT AA.*,A.lastReportTime FROM ("
	+ " SELECT DISTINCT ra.device_code,rlo.imei,rlo.imsi,rlo.version,ouc.id as ChannelId ,vr.endTime, ouc.channelName,vii.licensePlate,vii.device_bind_time FROM Realtime_Alarm ra" 
	+ " JOIN Realtime_Location_OBD rlo ON rlo.device_code=ra.device_code "
	+ " LEFT JOIN OBD_User_Channel ouc ON ouc.id=rlo.channelId "
	+ " LEFT JOIN Vehicle_Info vii on ra.device_code = vii.device_code "
	+ " LEFT JOIN ( SELECT * FROM Vehicle_Route vr WHERE id IN ( SELECT MAX (id) FROM "
			+"Vehicle_Route GROUP BY device_code)) vr ON ra.device_code = vr.device_code"
	+ " WHERE NOT EXISTS ("
	+ " SELECT * FROM Realtime_Alarm A WHERE ra.device_code = A.device_code AND A.alarm_no = 204 AND A.create_time >  DATEADD(DAY, -90, GETDATE()))"
	+" AND ra.create_time >  DATEADD(DAY, -90, GETDATE()) AND ra.device_code IN ("
	+" SELECT vi.device_code FROM Vehicle_Info vi JOIN Realtime_Location_OBD rlo ON rlo.device_code = vi.device_code AND rlo.device_type = 1 )"
	+") AS AA "
	+ "JOIN (SELECT vi.device_code,CASE "
	+ "WHEN ra.lastReportTime > rl.lastReportTime THEN "
		+ "ra.lastReportTime "
	+ "ELSE "
		+ "rl.lastReportTime "
	+ "END AS lastReportTime "
	+ "FROM "
	+ "	Vehicle_Info vi "
	+ "JOIN Realtime_Location_OBD rlo ON rlo.device_code = vi.device_code "
	+ "JOIN ( "
	+ "	SELECT "
	+ "		device_code, "
	+ "		MAX (create_time) lastReportTime "
	+ "	FROM "
	+ "		Realtime_Alarm"
	+ "	GROUP BY "
	+ "		device_code "
	+ ") ra ON ra.device_code = vi.device_code "
	+ "JOIN ( "
	+ "	SELECT "
	+ "		device_code, "
	+ "		MAX (create_time) lastReportTime "
	+ "	FROM "
	+ "		Realtime_Location "
	+ "	GROUP BY "
	+ "		device_code "
	+ ") rl ON rl.device_code = vi.device_code "
	+ "AND rlo.device_type = 1 "
	+ ") A ON A.device_code = AA.device_code AND AA.ChannelId != 72"
	,function(err,result){
		if(err){
			return res.end(JSON.stringify(err));
		}
		return res.end(JSON.stringify(arguments[1].recordsets[0]));
	});
});

router.get("/con_exception.page",function(req,res,next){
	res.render('con_exception');
});
/**
 * 最后上报事件&最后形成结束时间超过7天
 */
router.get("/con_exception",function(req,res,next){
	res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
	db.query("SELECT vr.device_code,rlo.imei,rlo.imsi,vr.endTime,A.lastReportTime,vii.licensePlate,vii.device_bind_time,ouc.channelName FROM "
			+"(SELECT * FROM Vehicle_Route vr WHERE id IN ( SELECT MAX (id) FROM "
			+"Vehicle_Route GROUP BY device_code)) vr "
		+"JOIN ("
			+"SELECT "
			+"	vi.device_code, "
			+"	CASE "
			+"WHEN ra.lastReportTime > rl.lastReportTime THEN "
			+"	ra.lastReportTime "
			+"ELSE "
			+"	rl.lastReportTime "
			+"END AS lastReportTime "
			+"FROM "
			+"	Vehicle_Info vi "
			+"JOIN Realtime_Location_OBD rlo ON rlo.device_code = vi.device_code "
			+"JOIN ( "
			+"	SELECT "
			+"		device_code, "
			+"		MAX (create_time) lastReportTime "
			+"	FROM "
			+"		Realtime_Alarm "
			+"	GROUP BY "
			+"		device_code "
			+") ra ON ra.device_code = vi.device_code "
			+"JOIN ( " 
			+"	SELECT "
			+"		device_code, "
			+"		MAX (create_time) lastReportTime "
			+"	FROM "
			+"		Realtime_Location "
			+"	GROUP BY "
			+"		device_code "
			+") rl ON rl.device_code = vi.device_code "
			+"AND rlo.device_type = 1 "
		+") A ON A.device_code = vr.device_code "
		+"AND DATEDIFF(DAY,vr.endTime,A.lastReportTime) > 10 "
		+"JOIN Realtime_Location_OBD rlo ON rlo.device_code = vr.device_code "
		+ " LEFT JOIN Vehicle_Info vii on rlo.device_code = vii.device_code "
		+ " LEFT JOIN OBD_User_Channel ouc ON ouc.id=rlo.channelId WHERE ouc.id != 72 ",function(err,result){
		if(err){
			return res.end(JSON.stringify(err));
		}
		return res.end(JSON.stringify(arguments[1].recordsets[0]));
	});
});

router.get("/con_overmonth.page",function(req,res,next){
	res.render('con_overmonth');
});
/**
 * 超过一个月没有数据上报
 */
router.get("/con_overmonth",function(req,res,next){
	res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
	db.query("SELECT rlo.device_code,rlo.imei,rlo.imsi,A.lastReportTime,vii.licensePlate,vii.device_bind_time,vr.endTime,ouc.channelName FROM Realtime_Location_OBD rlo"
		+" JOIN ("
			+"SELECT "
			+"	vi.device_code, "
			+"	CASE "
			+"WHEN ra.lastReportTime > rl.lastReportTime THEN "
			+"	ra.lastReportTime "
			+"ELSE "
			+"	rl.lastReportTime "
			+"END AS lastReportTime "
			+"FROM "
			+"	Vehicle_Info vi "
			+"JOIN Realtime_Location_OBD rlo ON rlo.device_code = vi.device_code "
			+"JOIN ( "
			+"	SELECT "
			+"		device_code, "
			+"		MAX (create_time) lastReportTime "
			+"	FROM "
			+"		Realtime_Alarm "
			+"	GROUP BY "
			+"		device_code "
			+") ra ON ra.device_code = vi.device_code "
			+"JOIN ( " 
			+"	SELECT "
			+"		device_code, "
			+"		MAX (create_time) lastReportTime "
			+"	FROM "
			+"		Realtime_Location "
			+"	GROUP BY "
			+"		device_code "
			+") rl ON rl.device_code = vi.device_code "
			+"AND rlo.device_type = 1 "
		+") A ON rlo.device_code = A.device_code "
		+ " LEFT JOIN Vehicle_Info vii on rlo.device_code = vii.device_code "
		+ " LEFT JOIN OBD_User_Channel ouc ON ouc.id=rlo.channelId "
		+ " LEFT JOIN (SELECT * FROM Vehicle_Route vr WHERE id IN ( SELECT MAX (id) FROM "
			+"Vehicle_Route GROUP BY device_code)) vr ON vr.device_code = rlo.device_code"
		+" WHERE rlo.device_type = 1 AND rlo.imei like '8694490214%' AND ouc.id != 72 AND vii.id IS NOT NULL AND DATEDIFF(DAY,A.lastReportTime,getDate()) > 10",function(err,result){
		if(err){
			return res.end(JSON.stringify(err));
		}
		return res.end(JSON.stringify(arguments[1].recordsets[0]));
	});
});


/**
 * 获取状态分析页面
 */
router.get('/debug.page',function(req,res,next){
	res.render('debug');
});

router.get('/lastest_event',function(req,res,next){
	res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
	db.query("SELECT a_t.name,ra.alarm_time,ra.create_time,ra.latitude,ra.longitude,ra.is_location from Realtime_Alarm ra LEFT JOIN Alarm_type a_t "
			+" ON ra.alarm_no = a_t.no where ra.device_code = "+ req.query.device_code +" AND ra.alarm_no > 199 order by create_time desc",
		function(err,result){
			if(err){
				return res.end(JSON.stringify(err));
			}
			return res.end(JSON.stringify(arguments[1].recordsets[0]));
		});
});

/**
 * 获取最后10个行程
 */ 
router.get('/routes',function(req,res,next){
	res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
	db.query("SELECT top 10 vr.startTime,vr.endTime,vr.startLatitude,vr.startLongitude,vr.startLocation,vr.endLatitude,vr.endLongitude,vr.endLocation,vr.create_time from Vehicle_Route vr"
			+" where vr.device_code = "+ req.query.device_code +" order by id DESC ",
		function(err,result){
			if(err){
				return res.end(JSON.stringify(err));
			}
			return res.end(JSON.stringify(arguments[1].recordsets[0]));
		});
});

/**
 * 当月流量情况
 */
router.get('/flow',function(req,res,next){
	res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
	db.query("SELECT top 10 start_time,end_time,flow,total_flow,create_time from Flow_Usage_201709 where imei = (SELECT imei FROM Realtime_Location_OBD rlo where rlo.device_code = "
		+ req.query.device_code + ") ORDER BY id DESC",function(err,result){
		if(err){
			return res.end(JSON.stringify(err));
		}
		return res.end(JSON.stringify(arguments[1].recordsets[0]));
	});
});

router.get("/search.page",function(req,res,next){
	res.render('search');
});
module.exports = router;