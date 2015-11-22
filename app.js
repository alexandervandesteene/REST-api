var http = require('http').Server(app); // http server
var mysql = require('mysql'); // Mysql include
var bodyParser = require("body-parser"); // Body parser for fetch posted data
var config = require("./config.json");

var connection = mysql.createConnection({ // Mysql Connection
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  port : config.port,
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data


app.get('/book',function(req,res){
    var data = {
        "error":1,
        "Books":""
    };

    connection.query("SELECT * from book",function(err, rows, fields){
        if(rows.length != 0){
            data["error"] = 0;
            data["Books"] = rows;
            res.json(data);
        }else{
            data["Books"] = 'No books Found..';
            res.json(data);
        }
    });
});

app.post('/book',function(req,res){
    var Bookname = req.body.bookname;
    var Authorname = req.body.authorname;
    var Price = req.body.price;
    var data = {
        "error":1,
        "Books":""
    };
    if(!!Bookname && !!Authorname && !!Price){
        connection.query("INSERT INTO book VALUES('',?,?,?)",[Bookname,Authorname,Price],function(err, rows, fields){
            if(!!err){
                data["Books"] = "Error Adding data";
            }else{
                data["error"] = 0;
                data["Books"] = "Book Added Successfully";
            }
            res.json(data);
        });
    }else{
        data["Books"] = "Please provide all required data (i.e : Bookname, Authorname, Price)";
        res.json(data);
    }
});

app.put('/book',function(req,res){
    var Id = req.body.id;
    var Bookname = req.body.bookname;
    var Authorname = req.body.authorname;
    var Price = req.body.price;
    var data = {
        "error":1,
        "Books":""
    };
    if(!!Id && !!Bookname && !!Authorname && !!Price){
        connection.query("UPDATE book SET BookName=?, AuthorName=?, Price=? WHERE id=?",[Bookname,Authorname,Price,Id],function(err, rows, fields){
            if(!!err){
                data["Books"] = "Error Updating data";
            }else{
                data["error"] = 0;
                data["Books"] = "Updated Book Successfully";
            }
            res.json(data);
        });
    }else{
        data["Books"] = "Please provide all required data (i.e : id, Bookname, Authorname, Price)";
        res.json(data);
    }
});

app.delete('/book',function(req,res){
    var Id = req.body.id;
    var data = {
        "error":1,
        "Books":""
    };
    if(!!Id){
        connection.query("DELETE FROM book WHERE id=?",[Id],function(err, rows, fields){
            if(!!err){
                data["Books"] = "Error deleting data";
            }else{
                data["error"] = 0;
                data["Books"] = "Delete Book Successfully";
            }
            res.json(data);
        });
    }else{
        data["Books"] = "Please provide all required data (i.e : id )";
        res.json(data);
    }
});
