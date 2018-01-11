var express = require('express');
var router = express.Router();


var connection = require("./db");

//跨域
router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get("/store",function  (req,res) {
	var sql = "select count(*) from store";
	connection.query(sql,function  (err,data) {
		if (err) {
			console.log(err)
		} else{
			var total = data[0]["count(*)"];
			var sql = "select * from store limit 0,5";
			connection.query(sql,function  (err,data) {
				if (err) {
					console.log(err)
				} else{
					var result = {total:total,data:data}
					res.send(result)
				}
			})
			
		}
	})
	
})
//分页接口
router.get('/storelimit',function(req,res){
	
	var page = req.query.page;
	var size = req.query.size;
	console.log('page',page)
	if(page != undefined){
		
		var sql = "select * from store limit "+(page*size)+","+size+"";
		connection.query(sql,function(err,data){
			if(err){
				console.log(err)
			}else{
				var result = {data:data}
				res.send(result)
			}
		})
	}
	
	
})



//请求手机表的接口
router.get("/phone",function  (req,res) {
	
	var sql = "select * from detail";
	
	connection.query(sql,function  (err,data) {
		if (err) {
			console.log(err)
		} else{
			var result = {data:data}
			res.send(result)
		}
	})
	
})





module.exports = router;
