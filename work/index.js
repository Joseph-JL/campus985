var express = require('express');
var app = express();
var fs = require("fs");


//添加的新用户数据
var user = {
   "user4" : {
      "name" : "mohit",
      "password" : "password4",
      "profession" : "teacher",
      "id": 4
   }
}

app.use('/public', express.static('public'));

app.get('/getMovie', function (req, res) {
   // 读取已存在的数据
   fs.readFile( __dirname + "/" + "douban.json", 'utf8', function (err, data) {
      data = JSON.parse( data );
      console.log( data );
      var key="id"+req.query.id;
      var resdata = data[key] 
      console.log( resdata );
      res.header("Content-Type", "application/json; charset=utf-8")
      res.end( JSON.stringify(resdata));
   });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})