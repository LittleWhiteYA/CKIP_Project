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

var type = "Post_"+process.argv[2];
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
		pos = parseInt(arr[i][8]);
		neg = parseInt(arr[i][9]);
		if(pos > neg)
			Property = 1;
		else if(pos < neg)
			Property = -1;
		else if(pos == neg)
			Property = 0;
		else
			Property = 100;

		if(Property != 100){
			var data = {
					File_num: arr[i][0],
					Source: arr[i][1],
					Attribute: arr[i][2],
					Title: arr[i][3],
					Link: arr[i][4],
					Author: arr[i][5],
					Time: arr[i][6],
					Content: arr[i][7],
					PosWordCount: arr[i][8],
					NegWordCount: arr[i][9],
					TotalComments : arr[i][10],
					PosComments : arr[i][11],
					NegComments : arr[i][12],
					PosOrNeg: Property
		
			};
			connection.query('INSERT INTO `Post` SET ?',data, function(error){
				if(error){
					console.log(error);
					console.log('寫入資料失敗！');
					//console.log(error.code); // 'ECONNREFUSED'
					//console.log(error.fatal); // true
					throw error;
				}
				++count;
				console.log("count: "+count);
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
