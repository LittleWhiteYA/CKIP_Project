var mysql = require('mysql');

var db_config = {
    host: '140.116.245.134',
    user: 'project',
    password: '00000000',
    database: 'project'
};

var connection = mysql.createConnection(db_config);

connection.connect(function(err){
	if(err){
		console.log('error when connecting to db!', err);
}
});

console.log("start connect: "+new Date());

var query = 'Show TABLES';
var query2 = 'SELECT Time,Content FROM ';
var table_list = [];
connection.query(query, function(err, result){
	if(err)
		console.log(err);

	table_list = result;
	select_table(table_list);
});

function select_table(table){
	var merge_result = [];
	for(var i = 2; i<3; ++i){
		console.log(i+" "+table[i]['Tables_in_project']);
		connection.query(query2+table[i]['Tables_in_project'],function(error, result2){
			if(error){
				console.log('error in query table! ',error);
			}
			console.log("start handle! "+new Date());
			console.log("result length: "+result2.length);
			result = handle_result(result2);
			merge_result.push(result);
			console.log("end handle! "+new Date());
			console.log("=========");
		});
	}

	connection.end(function(err){
		if(err)
			console.log("connection end error!");
		console.log(merge_result[0]);
//		console.log("connect end: "+new Date());
	});
}


function split_noun(content){
	
	var noun_arr = [];
	noun_arr = content.split(' ').filter(function(val){
			val = val.substring(val.lastIndexOf('-')+1);
			return val=='N';
	});
	noun_arr = noun_arr.map(function(val){
			val = val.substring(0, val.length-2);
			return val;
	});	

	return noun_arr;
	
}

function handle_result(result){
	tmp = result;
	
	//log("map "+new Date());
	tmp = tmp.map(function(obj){
		obj['Time'] = obj['Time'].toLocaleDateString();
		obj['Content'] = split_noun(obj['Content']);
		return obj;
	});
	//log("sort "+new Date());
	tmp.sort(function(a,b){
		a_t = Date.parse(a['Time']);
		b_t = Date.parse(b['Time']);
		return a_t-b_t;
	});
	var index = 0;
	//log("reduce1 "+new Date());
	tmp = tmp.reduce(function(last, now){
		if(last[index] == undefined)
			last = last.concat(now);
		else{
			last_t = Date.parse(last[index]['Time']);
			now_t = Date.parse(now['Time']);
			diff_day = (now_t-last_t) / 86400 / 1000;
			//console.log(last[index]['Time']);
			//console.log(now['Time']);
			//console.log(diff_day);

			if(last[index]['Time'] == now['Time']){
				last[index]['Content'] = last[index]['Content'].concat(now['Content']);
			}
			/*else if(diff_day <= 10){
				last[index]['Content'] = last[index]['Content'].concat(now['Content']);
			}*/
			else{
				last = last.concat(now);
				++index;
			}
		}
		return last;
	}, []);
	
	//log("reduce2 "+new Date());
	tmp = tmp.reduce(function(last, now){
		var json = {};
		now['Content'].forEach(function(each){
			if(json[each] == undefined)
				json[each] = 1;
			else
				++json[each];
		});
		now['Content'] = json;
		last = last.concat(now);
		return last;

	}, []);
	//log("end! "+new Date());
	result = tmp;
	return result;
}

function log(a){
	console.log(a);
}
