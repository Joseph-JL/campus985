var express=require('express');
var app =express();
var mysql = require('mysql');
var bodyParser  = require("body-parser");


let https = require("https");
let fs = require("fs");



app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));


app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

//Post 接口测试
app.post('/abc', function (req, res) {
          var user_name=req.body.username;
          console.log(req.body);
          let result ={
                  "errcode":0,
                  "msg":"OK",
                  "data":'Got a POST request: username='+user_name
          }
          res.json(result);
})

//配置服务端口
var server = app.listen(80, function () {
  var port = server.address().port;
  console.log('App listening at %s', port);
})

