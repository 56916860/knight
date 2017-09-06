var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * 经纬度转换 X、Y Algorithm
 */
//http://astro.uchicago.edu/cosmus/tech/latlong.html

module.exports = router;