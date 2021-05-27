var express = require('express');
var qs = require("querystring");
var mysql = require('mysql');
var app = express();

var pool = mysql.createPool({
    host     : 'localhost',
    port     : 3306,
    database : 'joseph',
    user     : 'joseph',
    password : 'liu123456'
});

app.listen(80);

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/', function(req, res){
    res.send('Hello,myServer');
});

app.get('/test', function(req, res){
    pool.getConnection(function(err, connection){
        connection.query("select * from user",function(err, rows){
            if(err) {
                throw err;
            }else{
                let result = {
                    "status": "200",
                    "success": true,
                }
                result.data=rows;
                console.log( rows );
                res.json(result);
            }
        });
        connection.release();
    });
});


const querystring = require('querystring');
const request = require('request');

app.get('/getcode', function(req, res){
    var data = {
        'appid': "wxdbbebcc0c1b85819",
        'secret': "cddb8bf9e9544bba433650c09f626f07",
        'js_code': req.query.code,
        'grant_type': 'authorization_code'
    };
    console.log(data);
    var content = querystring.stringify(data);
    var url = 'https://api.weixin.qq.com/sns/jscode2session?' + content;
    request.get({
        'url': url
    }, (error, response, body) => {
        let result = JSON.parse(body);
        console.log(result)
        let sql = `select * from user where openid='${result.openid}'`;
        console.log(sql)
        pool.getConnection(function(err, connection){
            connection.query(sql,function(err, rows){
                if(err) {
                    console.log('err:', err.message);
                }else{
                    if(rows.length ==0){
                        let sql = `insert into user(openid,status) values('${result.openid}','0')`;
                        console.log(sql)
                        connection.query(sql, function (err, rows) {
                            if (err) {
                                console.log('err:', err.message);
                            }else{
                                console.log(rows);
                                result.id=rows.insertId
                                result.status =0
                                result.userid =null
                                console.log(result);
                                res.json(result)
                            }
                        });
                    }else{
                        console.log(rows);
                        result.id=rows[0].id
                        result.status=rows[0].status
                        result.userid=rows[0].userid
                        console.log(result);
                        res.json(result)
                    }
                }
            });
            connection.release();
        });

    })
});

const test=require('./test.js');
app.get('/getopenid2',test.abc);
