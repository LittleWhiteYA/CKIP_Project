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
var readline = require('readline');
var start_num = parseInt(process.argv[2]);
var end_num = parseInt(process.argv[3]);
var type = process.argv[4];
console.log("start: "+start_num+",end: "+end_num+", type: "+type);
console.log("=======================");
process_file(start_num, type, end_num);


function process_file(count, type, end){
	console.log(count);
	if(count<=end){
		var filename = '../../News_apple/w_'+type+'/w_'+type+'_'+count+'.txt';

		var lineReader = readline.createInterface({
			input: fs.createReadStream(filename)
		});


		var index = 0;
		var arr = [];
		lineReader.on('line', function(line){
			arr.push(line);
		});

		lineReader.on('close', function(err){
			if(err)
				console.log('err: '+err);
			insert(arr);
			++count;
			//if(count == 5)
			//	++count;
			process_file(count, type, end);
		});
	}
	else{
		connection.end(function(err){
			if(err)
				console.log("connection end err: "+err);
		});
	}	
}


function insert(arr){
	console.log("arr.length: "+arr.length);
	for(var i=0; i<arr.length; i=i+3){
		//console.log(arr[i+1]);
		var time = arr[i].split('/')[6];
		console.log(i+" "+time);
		var year = time.substring(0,4);
		var month = time.substring(4,6);
		var day = time.substring(6,8);
		var date_str = year+"-"+month+"-"+day;
		var data = {
			Source: type,
			Title: arr[i+1],
			Time: date_str,
			url: arr[i],
			Content: arr[i+2]
		};

		var num = 0;
		//console.log(arr[i+1]);
		
		connection.query('INSERT INTO `News` SET ?', data, function(err){
			if(err)
				console.log("insert err: "+err);
			//++num;
			//console.log("num: "+num);
		});
		
		//break;


	}
}










