/*---------------------------------------------配置------------------------------------------- */
var express=require('express');
var app =express();
var mysql = require('mysql');
var bodyParser  = require("body-parser");
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const request = require('request');
const querystring = require('querystring');

app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));

// 配置 https
let https = require("https");
const httpsOption = {
  key : fs.readFileSync("./https/5425625_mobile.liujie.site.key"),
  cert: fs.readFileSync("./https/5425625_mobile.liujie.site.pem")
}

//解决跨域问题
app.all('*', function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "X-Requested-With");
res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
res.header("X-Powered-By",' 3.2.1');
res.header("Content-Type", "application/json;charset=utf-8");
next();
});

//数据库连接池
var pool = mysql.createPool({
    host     : 'localhost',
    port     : 3306,
    database : 'joseph2021',
    user     : 'joseph2021',
    password : 'liu123456'
});

//小程序信息
//个人
const appId = "wxd7a384fe144be042";
const appSecret = "ed1f6d5550485a7915d81a3dc0dfb848";
//企业
// const appId = "wx6367be9bc0a51755";
// const appSecret = "5f1c343be53431891498a13f24bffa30";


/**-------------------------------------------配置---------------------------------------------*/

/**-------------------------------------------college信息请求查询数据库---------------------------------------------*/

//查询数据库表college_info，得到所有college基本信息
app.get('/college_Info', function (req, res) {
  //单表查询
  let sql = `SELECT * FROM college_info`
  console.log(sql);

  accessDatabase(sql).then(function(rows){
    console.log(rows);
    res.header("Content-Type", "application/json; charset=utf-8")
    res.end( JSON.stringify(rows));
  })
})

//查询数据库表college_info_video，得到相应college的video信息
app.get('/college_info_video', function (req, res) {
//单表查询
  console.log(req.query);
  // let sql ='SELECT * FROM college_info_video t1 INNER JOIN college_video t2 ON t1.videoId=t2.videoId WHERE t2.videotype<4 AND t1.collegeId='+req.query.collegeId;
  let sql ='SELECT * FROM college_video WHERE collegeId='+req.query.collegeId;
  

  console.log(sql);

  accessDatabase(sql).then(function(rows){
    console.log(rows);
    res.header("Content-Type", "application/json; charset=utf-8")
    res.end( JSON.stringify(rows));
  })
})

//查询数据库表college_info_photo，得到相应college的photo信息
app.get('/college_info_photo',function (req, res) {
  //单表查询
    console.log(req.query);
    // let sql ='SELECT * FROM college_info_photo t1 INNER JOIN college_photo t2 ON t1.photoId=t2.photoId WHERE t1.collegeId='+req.query.collegeId;
    let sql ='SELECT * FROM college_photo WHERE collegeId='+req.query.collegeId;

    console.log(sql);
  
    accessDatabase(sql).then(function(rows){
      console.log(rows);
      res.header("Content-Type", "application/json; charset=utf-8")
      res.end( JSON.stringify(rows));
    })
  })

//查询数据库表college_encyclopedia，得到相应college的百科信息
app.get('/college_encyclopedia', function (req, res) {
  //单表查询
    console.log(req.query);
    let sql ='SELECT * FROM college_encyclopedia WHERE collegeId='+req.query.collegeId;
    console.log(sql);
  
    accessDatabase(sql).then(function(rows){
      console.log(rows);
      res.header("Content-Type", "application/json; charset=utf-8")
      res.end( JSON.stringify(rows));
    })
  })

//查询数据库表college_entrance，得到相应college的招生录取信息
app.get('/college_entrance', function (req, res) {
  //单表查询
    console.log(req.query);
    let sql ='SELECT * FROM college_entrance WHERE collegeId='+req.query.collegeId;
    console.log(sql);
  
    accessDatabase(sql).then(function(rows){
      console.log(rows);
      res.header("Content-Type", "application/json; charset=utf-8")
      res.end( JSON.stringify(rows));
    })
  })

//查询数据库表college_panorama，得到相应college的全景游览信息
app.get('/college_panorama', function (req, res) {
  //单表查询
    console.log(req.query);
    let sql ='SELECT * FROM college_panorama WHERE collegeId='+req.query.collegeId;
    console.log(sql);
  
    accessDatabase(sql).then(function(rows){
      console.log(rows);
      res.header("Content-Type", "application/json; charset=utf-8")
      res.end( JSON.stringify(rows));
    })
  })

//查询数据库表college_video，得到college_all_video,按照clickCount倒序排序
app.get('/college_all_video',  function (req, res) {
  //多表查询
    console.log(req.query);
    // let sql ='SELECT * FROM college_video t1 JOIN college_info_video t2 ON t1.videoId=t2.videoId JOIN college_info t3 ON t2.collegeId=t3.collegeId WHERE t1.videoType<4';
    let sql ='SELECT * FROM college_video t1 JOIN college_info t2 ON t1.collegeId=t2.collegeId order by clickCount desc';

    console.log(sql);
  
    accessDatabase(sql).then(function(rows){
      console.log(rows);
      res.header("Content-Type", "application/json; charset=utf-8")
      res.end( JSON.stringify(rows));
    })
})

//查询数据库表college_video，得到college_all_video,按照学校倒序排序
app.get('/college_all_video_standard',  function (req, res) {
  //多表查询
    console.log(req.query);
    // let sql ='SELECT * FROM college_video t1 JOIN college_info_video t2 ON t1.videoId=t2.videoId JOIN college_info t3 ON t2.collegeId=t3.collegeId WHERE t1.videoType<4';
    let sql ='SELECT * FROM college_video t1 JOIN college_info t2 ON t1.collegeId=t2.collegeId order by videoId';

    console.log(sql);
  
    accessDatabase(sql).then(function(rows){
      console.log(rows);
      res.header("Content-Type", "application/json; charset=utf-8")
      res.end( JSON.stringify(rows));
    })
})

//查询数据库表college_video，相应视频播放量clickCount加1
app.post('/add_college_video_click_count',  function (req, res) {
    console.log(req.body)
    //clickCount自增
    let sql ='UPDATE college_video SET clickCount = clickCount + 1 WHERE videoId = '+req.body.videoId;
    console.log(sql);
  
    accessDatabase(sql).then(function(rows){
      console.log(rows.affectedRows);
      //根据删除后的rows.affectedRows返回
      var result={flag:false};//【问题易错】js中变量定义等号需要有空格
      //1删除失败,不操作
      //2删除成功
      if(rows.affectedRows>0){
        result.flag=true;
      }
      res.header("Content-Type", "application/json; charset=utf-8")
      res.end( JSON.stringify(result));
    })
  })

/**-------------------------------------------college信息请求查询数据库---------------------------------------------*/

/**-------------------------------------------登录,返回前端小程序token值---------------------------------------------*/
app.post('/onLogin', function (req, res) {
  console.log(req.body) //查看请求的body里面的内容
  let that = this
  var data = {
      'appid': appId,
      'secret': appSecret,
      'js_code': req.body.code,
      'grant_type': 'authorization_code'
  };
  console.log(data);
  var content = querystring.stringify(data);
  var url = 'https://api.weixin.qq.com/sns/jscode2session?' + content;
  console.log("url"+url);
  request.get({
      'url': url
  }, (error, response, body) => {
      console.log(body);
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


//token相当于MD5加密=>利用uid（用户id）加密生成token（uid和token一一对应）
function generateToken(data) {
  let created = Math.floor(Date.now() / 1000);
  let cert = fs.readFileSync(path.join(__dirname, './rsa_keys/rsa_private_key.pem'));//私钥
  let token = jwt.sign({
      data,
      exp: created + 60 * 60 * 24,
  }, cert, {algorithm: 'RS256'});
  return token;
}
//利用token解密出uid
function verifyToken(token) {
  let cert = fs.readFileSync(path.join(__dirname, './rsa_keys/rsa_public_key.pem'));//公钥
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
                  console.log('老用户'+rows[0].userId)
                  uid =rows[0].userId
                  resolve(uid);
                }else{
                   let sql = `insert into user(openid,lastLoginTime) values('${openid}','2020-01-01 20:20:20')`;
                   console.log(sql)
                   connection.query(sql, function (err, rows) {
                            if (err) {
                                console.log('err:', err.message);
                            }else{
                              console.log("新用户")
                              console.log(rows)
                                console.log("新用户"+rows.insertId)
                                uid =rows.insertId
                                resolve(uid);
                                //如果是新用户，在user_post中添加初始帖子
                                fs.readFile( __dirname + "/" + "public"+ "/" + "user_post_default_saying.json", 'utf8', function (err, data) {
                                  data = JSON.parse( data );
                                  for(var i=0;i<Object.keys(data).length;i++){
                                      var key="post"+i;
                                      // 上传帖子
                                      var publishTime=(new Date()).Format("yyyy年MM月dd日hh:mm:ss")
  
                                      let sql =` INSERT INTO user_post (userId, colorOfMoodStatus, postTitle, postContent, publishPosition , publishTime, postStatus,defaultDisplay) VALUES ('${uid}','${data[key].colorOfMoodStatus}', '${data[key].postTitle}', '${data[key].postContent}', '${data[key].publishPosition}', '${publishTime}', '${data[key].postStatus}','${data[key].defaultDisplay}')`;  
                                      console.log(sql);
  
                                      accessDatabase(sql).then(function(rows){
                                        console.log(rows);
                                        console.log(rows.affectedRows);
                                        //根据删除后的rows.affectedRows返回
                                        // var result={flag:false};//【问题易错】js中变量定义等号需要有空格
                                        //1删除失败,不操作
                                        //2删除成功,此处也不操作
                                        // if(rows.affectedRows>0){
                                        //   result.flag=true;
                                        // }
                                        // res.header("Content-Type", "application/json; charset=utf-8")
                                        // res.end( JSON.stringify(result));
                                      })
                                  }
                                });
  
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
  

/**-------------------------------------------登录,返回前端小程序token值---------------------------------------------*/


/**-------------------------------------------我的，帖子---------------------------------------------*/
//“我的”页面中心标题
app.post('/center_title',  function (req, res) {
  console.log(req.body) //查看请求的body里面的内容

  //设置“我的”页面中心标题+是否显示帖子位置和时间
  let retData={
    //真实
    
    centerTitle: "心情记录",
    publishTimeDisplayFlag:true,
    publishPositionDisplayFlag:true
    
    //伪装    
    /*
    centerTitle: "励志名言(右侧可提交您对开发者的建议）",
    publishTimeDisplayFlag:false,
    publishPositionDisplayFlag:false
    */


  }

  res.header("Content-Type", "application/json; charset=utf-8")
  res.end( JSON.stringify(retData));
})

//查询数据库表user_post，得到本用户的所有帖子  
app.post('/my_user_post',  function (req, res) {
  console.log(req.body) //查看请求的body里面的内容

  //用户token验证,用token得到userId
  let token = req.body.token;
  let userId = verifyToken(token);
  console.log("userid:"+userId);

  //多表查询
    //仅仅测试sql
    // let sql ='SELECT * FROM user_post t1 JOIN color_of_mood t2 ON t1.colorOfMoodStatus=t2.colorOfMoodStatus WHERE t1.defaultDisplay=0 AND t1.userId='+userId+' order by postId desc';
    //真实sql
    let sql ='SELECT * FROM user_post t1 JOIN color_of_mood t2 ON t1.colorOfMoodStatus=t2.colorOfMoodStatus WHERE t1.userId='+userId+' order by postId desc';
    console.log(sql);
  
    accessDatabase(sql).then(function(rows){
      console.log(rows);
      res.header("Content-Type", "application/json; charset=utf-8")
      res.end( JSON.stringify(rows));
    })
  })

  
//查询数据库表user_post，删除特定postId的帖子  
app.post('/delete_one_my_user_post',  function (req, res) {
  console.log(req.body) //查看请求的body里面的内容

  //用户token验证,用token得到userId
  let token = req.body.token;
  let userId = verifyToken(token);
  console.log("userid:"+userId);

  //根据token解析出来的userId和传过来的postId查询数据库，删帖
  //多表查询
  // let sql ='SELECT * FROM user_post WHERE userId='+userId+' AND postId='+req.body.postId;
  let sql ='DELETE FROM user_post WHERE userId='+userId+' AND postId='+req.body.postId;  
  console.log(sql);

  accessDatabase(sql).then(function(rows){
    console.log(rows.affectedRows);
    //根据删除后的rows.affectedRows返回
    var result={flag:false};//【问题易错】js中变量定义等号需要有空格
    //1删除失败,不操作
    //2删除成功
    if(rows.affectedRows>0){
      result.flag=true;
    }
    res.header("Content-Type", "application/json; charset=utf-8")
    res.end( JSON.stringify(result));
  })
})

//发布帖子初始化页面，查询心情色块,不需要token验证，get1请求
app.get('/color_of_mood',  function (req, res) {
  //设置标题内容输入框默认文字,是否显示位置图标标志位
  var retData={    
    // 真实数据
    
    titiePlaceholder:"标题，可选，不超过20个字",
    colorPlaceholder:"点击左侧颜色切换心情",
    contentPlaceholder:"这一刻的想法，不超过300字",
    positionDisplayFlag:true,
    formSubmitPlaceholder:"发布",
    
    //伪装数据
    /*
    titiePlaceholder:"您的建议概述",
    colorPlaceholder:"",
    contentPlaceholder:"请详细描述您的建议，以便开发者完善用户体验",
    positionDisplayFlag:false,
    formSubmitPlaceholder:"提交",
    */

    colorArray:null
  }

  //多表查询,返回颜色色块
    console.log(req.query);
    let sql ='SELECT colorOfMoodStatus,colorValue,colorDesciption FROM color_of_mood';
    console.log(sql);
  
    accessDatabase(sql).then(function(rows){
      console.log(rows);
      retData.colorArray=rows;
      res.header("Content-Type", "application/json; charset=utf-8")
      res.end( JSON.stringify(retData));
    })
})

//发布帖子，将数据插入user_post表中
app.post('/publish_user_post',  function (req, res) {
  console.log(req.body) //查看请求的body里面的内容

  //用户token验证,用token得到userId
  let token = req.body.token;
  let userId = verifyToken(token);
  console.log("userid:"+userId);

  //根据token解析出来的userId和传过来的帖子相关数据查询数据库，上传帖子
  //获取当前时间，作为用户上传时间
  var publishTime=(new Date()).Format("yyyy年MM月dd日hh:mm:ss")

  let sql =` INSERT INTO user_post (userId, colorOfMoodStatus, postTitle, postContent, publishPosition , publishTime, postStatus, defaultDisplay) VALUES ('${userId}','${req.body.colorOfMoodStatus}', '${req.body.postTitle}', '${req.body.postContent}', '${req.body.publishPosition}', '${publishTime}', '${req.body.postStatus}', 1)`;  
  console.log(sql);

  accessDatabase(sql).then(function(rows){
    console.log(rows);
    console.log(rows.affectedRows);
    //根据删除后的rows.affectedRows返回
    var result={flag:false};//【问题易错】js中变量定义等号需要有空格
    //1删除失败,不操作
    //2删除成功
    if(rows.affectedRows>0){
      result.flag=true;
    }
    res.header("Content-Type", "application/json; charset=utf-8")
    res.end( JSON.stringify(result));
  })
})

/**-------------------------------------------我的，帖子---------------------------------------------*/


/**-------------------------------------------励志--------------------------------------------------*/
//查询数据库表inspire_movie，得到励志电影信息 
app.post('/inspire_movie',  function (req, res) {
  //不需要验证token
  //多表查询
    let sql ='SELECT * FROM inspire_movie order by movieId';
    console.log(sql);
  
    accessDatabase(sql).then(function(rows){
      console.log(rows);
      res.header("Content-Type", "application/json; charset=utf-8")
      res.end( JSON.stringify(rows));
    })
  })

//查询数据库表inspire_audio，得到励志音频信息 
app.post('/inspire_audio',  function (req, res) {
  //不需要验证token
  //多表查询
    let sql ='SELECT * FROM inspire_audio order by audioId';
    console.log(sql);
  
    accessDatabase(sql).then(function(rows){
      console.log(rows);
      res.header("Content-Type", "application/json; charset=utf-8")
      res.end( JSON.stringify(rows));
    })
  })

//查询数据库表inspire_article，得到励志文章信息 
app.post('/inspire_article',  function (req, res) {
  //不需要验证token
  //多表查询
    let sql ='SELECT * FROM inspire_article order by articleId';
    console.log(sql);
  
    accessDatabase(sql).then(function(rows){
      console.log(rows);
      res.header("Content-Type", "application/json; charset=utf-8")
      res.end( JSON.stringify(rows));
    })
  })

//查询数据库表inspire_knowledge，得到励志必知信息 
app.post('/inspire_knowledge',  function (req, res) {
  //不需要验证token
  //多表查询
    let sql ='SELECT * FROM inspire_knowledge order by knowledgeId';
    console.log(sql);
  
    accessDatabase(sql).then(function(rows){
      console.log(rows);
      res.header("Content-Type", "application/json; charset=utf-8")
      res.end( JSON.stringify(rows));
    })
  })
/**-------------------------------------------励志--------------------------------------------------*/



//查询数据库
function accessDatabase(sql){
  let promise = new Promise((resolve,reject)=>{

      pool.getConnection(function(err, connection){
        connection.query(sql,function(err, rows){
            if(err) {
                throw err;
            }else{                
                console.log( rows );
                resolve(rows);
            }
        });
        connection.release();
      });
  })
  return promise;
}

//Data时间格式属性添加
Date.prototype.Format = function(fmt) { //author: meizz
  var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

//访问json
app.get('/liujie', function (req, res) {
    // 读取已存在的数据
    fs.readFile( __dirname + "/" + "public"+ "/" + "user_post_default.json", 'utf8', function (err, data) {
      data = JSON.parse( data );
      console.log(typeof data);
      console.log(Object.keys(data).length)
      var post = data["post1"] 
      console.log( post );
      res.end( JSON.stringify(data));
    });
})

//public静态资源访问
app.use('/public', express.static('public'));

var server = app.listen(80, function () {
  var port = server.address().port;
  console.log('App listening at %s', port);
})
https.createServer(httpsOption, app).listen(443);
