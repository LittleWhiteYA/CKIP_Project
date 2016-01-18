var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io'); // 加入 Socket.IO
var qs = require('querystring');
var telephone = require('/home/lu/webpage/analysis/telephone');
var ptt = require('/home/lu/webpage/analysis/politics');
//var telephone = require('./tmp_telephone');
//var ptt = require('./tmp_politics');
var newsjs = require('/home/lu/mobile01/nodejs/news');

var server = http.createServer(function(request, response) {
	console.log('Connecting http');
	var req_url = url.parse(request.url);
	//console.log(req_url);
	var path = req_url.pathname;
	switch (path) {
		case '/':
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write('Hello, World.');
			response.end();
			break;
		case '/LineChart.html':
			//file_path = __dirname + path;
			file_path = "/home/lu/webpage/LineChart/five.html";
			log(file_path);
			fs.readFile(file_path, function(error, data) {
				if (error){
					response.writeHead(404);
					response.write("opps this doesn't exist - 404");
				}
				else {
					response.writeHead(200, {"Content-Type": "text/html"});
					response.write(data, "utf8");
					var method = request.method;
					console.log(method);
					/*
					if(method == 'POST'){
						var post_str = '';
						request.on("data", function(data_buffer){
							return post_str += data_buffer;
						});
						
						request.on("end", function(){
							var post = qs.parse(post_str);
							console.log("post:");
							console.log(post);
						});
					}
					else if(method == 'GET'){
						var parameter = qs.parse(req_url.query);
						console.log("parameter: ");
						console.log(parameter);
					}
					*/
				}
				response.end();
			});
			break;

		 case '/draw.js':
            css_path = "/home/lu/webpage/LineChart/draw.js";
              fs.readFile(css_path, function (err, data) {
                if (err) console.log(err);
                    response.writeHead(200, {"Content-Type": "text/javascript"});
                    response.write(data, "utf8");
                    response.end();
              });
            break;

		case '/style.css':
			css_path = "/home/lu/webpage/LineChart/style.css";
              fs.readFile(css_path, function (err, data) {
                if (err) console.log(err);
                    response.writeHead(200, {"Content-Type": "text/css"});
                    response.write(data, "utf8");
					response.end();
              });
			break;
		default:
			response.writeHead(404);
			response.write("opps this doesn't exist - 404");
			response.end();
			break;
	}
});

var port = parseInt(process.argv[2]);
server.listen(port);
log(port);
console.log("Server start "+new Date());
serv_io = io.listen(server); // 開啟 Socket.IO 的 listener


var mysql = require('mysql');
var db_config = {
	host: '140.116.245.134',
	user: 'project',
	password: '00000000',
	database: 'project',
};
var connection = mysql.createConnection(db_config);
connection.connect(function(err){
	if(err)
		console.log('error when connecting to db!', err);
	console.log("start connect: "+new Date());
});




var time_list = [];
var circle_result = [];

/*
telephone.mobile(connection, function(return1, return2){
	time_list = return1;
	circle_result = return2;
	//log(time_list);
});
*/


var time_list1 = [];
var circle_result1 = [];
ptt.politics(connection, function(return1, return2){
	time_list1 = return1;
	circle_result1 = return2;
});


var news_json = {};
newsjs.news(connection, function(return1){
	news_json = return1;
	//log(news_json);
});


serv_io.sockets.on('connection', function(socket){
	socket.emit('message', {'message': 'hello world!'});
	
	/*
	if(Object.keys(news_json).length != 0){
		//log("rate1 in server: ");
		//log(rate1);
		socket.emit('news', news_json);
	}
	*/
	/*if(time_list2.length != 0 && circle_result2.length != 0){
		var tmp = {
			time_list: time_list2,
			circle_result: circle_result2
		}
		socket.emit('ptt', tmp);
	}*/
	if(time_list1.length != 0 && circle_result1.length != 0 && Object.keys(news_json).length != 0){	
	//if(time_list.length != 0 && circle_result.length != 0 && Object.keys(news_json).length != 0 && time_list1.length != 0 && circle_result1.length != 0){
		//time_list = time_list.concat(time_list1);
		//circle_result = circle_result.concat(circle_result1);
		//console.log(time_list1);
		//log(news_json);
		var tmp = {
			news: news_json,
			//time_list: time_list,
			time_list1: time_list1,
			//circle_result: circle_result
			circle_result1: circle_result1
		}
		socket.emit('all', tmp);
	}
	else{
		log("not yet!");
	}


	

	
});


function log(a){
	console.log(a);
}
