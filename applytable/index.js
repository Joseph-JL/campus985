var express=require('express');
var app =express();
var mysql = require('mysql');
var bodyParser  = require("body-parser");
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const request = require('request');
const querystring = require('querystring');

const appId = "wx15fa730db3c5fead";
const appSecret = "9790ce0327810910e4b21e19141b4e27";

var pool = mysql.createPool({
    host     : 'localhost',
    port     : 3306,
    database : 'applytable',
    user     : 'applytable',
    password : 'liu123456'
});

app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));

function generateToken(data) {
        let created = Math.floor(Date.now() / 1000);
        let cert = fs.readFileSync(path.join(__dirname, './rsa_private_key.pem'));//私钥
        let token = jwt.sign({
            data,
            exp: created + 60 * 30,
        }, cert, {algorithm: 'RS256'});
        return token;
}

function verifyToken(token) {
        let cert = fs.readFileSync(path.join(__dirname, './rsa_public_key.pem'));//公钥
        let res;
        try {
            let result = jwt.verify(token, cert, {algorithms: ['RS256']}) || {};
            let {exp = 0} = result, current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                res = result.data || {};
            }
        } catch (e) {
            res = 'err';
        }
        return res;
}

app.post('/onLogin', function (req, res) {
    console.log(req.body) //查看请求的body里面的内容
    let that = this
    var data = {
        'appid': "wxdbbebcc0c1b85819",
        'secret': "cddb8bf9e9544bba433650c09f626f07",
        'js_code': req.body.code,
        'grant_type': 'authorization_code'
    };
    console.log(data);
    var content = querystring.stringify(data);
    var url = 'https://api.weixin.qq.com/sns/jscode2session?' + content;
    request.get({
        'url': url
    }, (error, response, body) => {
        let result = {}
        let body_result = JSON.parse(body);
        let openid = body_result.openid;
        console.log(openid)
        //通过数据库获取uid，输入：openid，输出：uid
        getuid(openid).then((res1) =>{
            result.token=generateToken(res1)
            res.json(result)
        });

     })
})


function getuid(openid){
  let promise = new Promise((resolve,reject)=>{
      let uid =0
      pool.getConnection(function(err, connection){
        let sql = `select * from user where openid = '${openid}'`
        connection.query(sql,function(err, rows){
            if(err) {
                throw err;
            }else{
                console.log( rows );
                if(rows.length>0){
                  console.log('老用户'+rows[0].id)
                  uid =rows[0].id
                  resolve(uid);
                }else{
                   let sql = `insert into user(openid,datetime) values('${openid}','2020-01-01 20:20:20')`;
                   console.log(sql)
                   connection.query(sql, function (err, rows) {
                            if (err) {
                                console.log('err:', err.message);
                            }else{
                                console.log("新用户"+rows.insertId)
                                uid =rows.insertId
                                resolve(uid);
                            }
                    });
                }
            }
        });
        connection.release();
      });
  })
  return promise;
}

app.use('/public', express.static('public'));

var server = app.listen(80, function () {
  var port = server.address().port;
  console.log('App listening at %s', port);
})
