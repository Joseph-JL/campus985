var mysql=require('mysql');

var connection=mysql.createConnection({
    host:'localhost',
    user:'joseph',
    password:"liu123456",
    database:"joseph"
});

connection.connect();
var sql='DELETE FROM user WHERE id=5';

connection.query(sql,function(error,results,fields){
    if(error) throw error;
    else{
        sql='select * from user'
        connection.query(sql,function(error,results,fields){
            if(error) throw error;
            else{
                console.log(results);
            }            
        })
    }
})
connection.end();