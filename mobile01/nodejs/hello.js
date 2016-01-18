
/*
var json = [1,2,3,4,5,3,4,5]
json.sort();
console.log(json)
*/

/*
function test(){
	var str = '123456789'
	str1 = str.substring(str.lastIndexOf(7));
	console.log("str1: "+str1);
	str2 = str.split('5',1);
	console.log("str2: "+str2);
}

exports.name = test;
//var abc = 5;
//exports.abc = abc;

function abc(arr){
	var tmp = arr;
	tmp.push("12345");
}

exports.abc = abc;

function log(a){
	console.log(a);
}


json = {'a':1, 'b':2, 'c': -1, 'd':0}

for(var i in json){
	log(i+" "+json[i]);
	log(typeof(json[i]));
}

log(Object.keys(json));
log(Object.keys(json).length);
*/


function test(){
	var mysql = require('mysql');
	var connection = mysql.createConnection({
		host: '140.116.245.134',
		user: 'project',
		password: '00000000',
		database: 'project'
	});
	
	connection.connect(function(err){
		if(err)	log(err);
	});
	
	return connection;
}


var connection = test();
/*
connection.query('select File_num from Post_ptt where Title LIKE \'%蔡英文%\' OR Content LIKE \'%蔡英文%\'', function(err, result){
	if(err)	throw err;
	for(var i=0; i<result.length; ++i){
		var query2 = 'select Author from Comment_ptt where File_num="'+result[i]['File_num']+'"';
		connection.query(query2, function(err, result2){
			log(result2);
		});
	}
	
	connection.end(function(err){
		if(err) log("end error: "+err);
	});
});
*/

var mobilejs = require('/home/lu/webpage/analysis/telephone');
mobilejs.mobile(connection, function(return1, return2){
	log(return1);
	log("=============");
	log(return2);
});

/*
var newsjs = require('./news');
newsjs.news(connection, function(return1){
	log(return1);
	connection.end(function(err){
		if(err)	throw err;
	});
});
*/

/*
function test(callback){
	callback(10);
	log("abcdefg");
	callback(20);
}

test(function(return1){
	log("return!");
	log(return1);
});
*/


/*arr1 = [];
arr1[0] = {name:'htc', arr:[1,2,3]};
arr2 = [];
arr2[0] = {name:'mi', arr:[4,5,6]};

arr3 = [];
arr3 = arr1.concat(arr2);
log(arr3);
*/

function log(a){
	console.log(a);
}



