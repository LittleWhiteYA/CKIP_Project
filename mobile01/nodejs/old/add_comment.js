//載入MySQL模組
var mysql = require('mysql');
//建立連線
var connection = mysql.createConnection({
	host: '140.116.245.134',
    user: 'project',
    password: '00000000',
    database: 'project'
});

connection.connect(function(err){
	if(err){
		console.log('error when connecting to db!', err);
	}
});

var fs = require('fs');
var csv = require('fast-csv');

var type = "Comment_"+process.argv[2];
console.log(type);
var stream = fs.createReadStream("/home/lu/mobile01/result/"+type+".csv");

var arr = []; 
var n = 0;
var csvStream = csv()
    .on("data", function(data){
		console.log("n: "+(n++));
		arr.push(data);
    })
    .on("end", function(){
		insert();
    });

stream.pipe(csvStream);

var count = -1;
function insert(){
	
	for(var i=0; i<arr.length; ++i){
		var Property;
		pos = parseInt(arr[i][4]);
		neg = parseInt(arr[i][5]);
		if(pos > neg)
			Property = 1;
		else if(pos < neg)
			Property = -1;
		else if(pos == neg)
			Property = 0;
		else
			Property = 100;
		if(Property != 100){
			var time = arr[i][2].substring(0, arr[i][2].lastIndexOf('#'));
			var data = {
				PostFile_num: arr[i][0],
				Author: arr[i][1],
				Time: time,
				Content: arr[i][3],
				PosCommentCount: arr[i][4],
				NegCommentCount: arr[i][5],
				PosOrNeg: Property
			};
			connection.query('INSERT INTO ' + process.argv[3] + ' SET ?',data, function(error){
				if(error){
					console.log(error);
					console.log('寫入資料失敗！');
					//console.log(error.code); // 'ECONNREFUSED'
					//console.log(error.fatal); // true
					throw error;
				}
				++count;
				console.log("count: "+count);
				//console.log(data);
				//console.log(count+"=================");
				
			});
		}
	}
	connection.end(function(err){
		if(err)
			console.log('connection end error.');
		console.log("End!");
	});

}
