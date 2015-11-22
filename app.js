var express = require('express');
var app = express();
var http = require('http').Server(app); // http server
var mysql = require('mysql'); // Mysql include
var bodyParser = require("body-parser"); // Body parser for fetch posted data
var config = require("./config.json");
var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data

var connection = mysql.createConnection({ // Mysql Connection
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});
connection.connect();


http.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.get('/',function(request, response){
    response.render('index.ejs',{title: 'Home'})
});


app.get('/book',function(req,res){
    console.log("haal boeken op");
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

app.get('/addbook',function(req,res){
	var Bookname = req.query.bookname;
	var Authorname = req.query.authorname;
	var Price = req.query.price;
  console.log(Bookname);
  console.log(Authorname);
  console.log(Price);
	var data = {
		"error":1,
		"Books":""
	};
	if(!!Bookname && !!Authorname && !!Price){
		connection.query("INSERT INTO book (BookName,AuthorName,Price) VALUES(?,?,?)",[Bookname,Authorname,Price],function(err, rows, fields){
			if(!!err){
				data["Books"] = "Error Adding data";
        console.log(err);
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
