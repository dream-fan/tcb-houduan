var express = require('express');
var router = express.Router();

var shortId = require("short-id");
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

//数据查询
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


router.post("/regist",function  (req,res) {
	var email = req.body.email;
	var password = req.body.password;
	console.log(email,password)
	var sql = "select * from regist where email='"+email+"' and password='"+password+"'";
	connection.query(sql,function  (err,data) {
		if (err) {
			console.log(err)
		} else{
			if (data.length == 0) {
				var id = shortId.generate();
				var addsql = "insert into regist(id,email,password) value(?,?,?)";
				connection.query(addsql,[id,email,password],function  (err,data) {
					if (err) {
						console.log(err)
					} else{
						res.send({status:"ok"})
					}
				})
			} else{
				res.send({status:"fail"})
			}
		}
	})
})
router.post('/login',function(req,res){
	var email = req.body.email;
	var password = req.body.password;
	console.log(email,password)
	var sql = "select * from regist where email='"+email+"' and password='"+password+"'";
	connection.query(sql,function(err,data){
		if(err){
			console.log(err)
		}else{
			console.log(data)
			//根据data的长度判断是否查询到用户
			if(data.length > 0){
				res.send({status:'ok'});	
			}else{
				res.send({status:'fail'});	
			}
			
		}
	})
})






module.exports = router;
