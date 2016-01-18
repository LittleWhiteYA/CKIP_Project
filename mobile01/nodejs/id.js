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

var query3 = 'SELECT Time,Author FROM ';
var time_list = [];

connection.query('Show TABLES', function(err, table_list){
	if(err)
		console.log(err);
	
	time_query(table_list);
	select_table(table_list);
});

function time_query(table){
	var q = 'SELECT MAX(Time) as Maximum,MIN(Time) as Minimum FROM ';
	var query2 = '';

	for (var i in table){
		if(table[i]['Tables_in_project'].length<=5)
			continue;
		else if(i == table.length-2)
			query2 += (q+table[i]['Tables_in_project']);
		else 
			query2 +=(q+table[i]['Tables_in_project'].toString()+ ' UNION ');
	}
	connection.query(query2,function(error, time){
		generate_time_array(time);
	});
}

function get_category(table){
	var category = [];
	for (var i in table){
		var tmp = table[i]['Tables_in_project'],len;
		if (tmp.indexOf('Comment') >= 0){
			if ((len = tmp.indexOf('_')) >= 0){
				var j;
				for (j=0;j<category.length;j++)
					if (j == tmp.substring(len+1)) break;
				if (j == category.length) category.push(tmp.substring(len+1));
			}
		}
	}
	return category;
}

function select_table(table){
	var result_list = []; // store query_result from Post_table and Comment_table
	
	var category = get_category(table);
	console.log('category = '+category);
	for(var i in category){
		console.log(category[i]);
		connection.query(query3+'Post_'+category[i],function(error, time_authr){
			console.log('Get query from Post '+new Date());
			if(error){
				console.log('error in query table! ',error);
			}
			
			result_list.push(handle_result(time_authr));
		});
		connection.query(query3+'Comment_'+category[i],function(error, time_authr){
			if (error){
				console.log('error in query comment table! ',error);
			}
			console.log('Get query from Comment '+new Date());
			result_list.push(handle_result(time_authr));
			console.log("=========================");
		});
		break;		
		
	}
	connection.end(function(err){
		if(err)
			console.log("connection end error!");
		console.log("merge start "+new Date());
		//var merge_result = merge_results(result_list);
		var merge_list = [];
		for(var i=0; i<result_list.length; i=i+2){
			var tmp = merge(result_list[i], result_list[i+1], key_name);
			merge_list.push(tmp);
		}
		console.log("merge end "+new Date());
		console.log('Start ranking authors '+new Date());
		author_ranking = ranking(merge_list)[0];
		console.log("connect end: "+new Date());
	});
}

function generate_time_array(time){
	var max = new Date('2000-01-01'),min = new Date('2015-12-20');
	for (var i in time){
		if (max < time[i]['Maximum']) max = time[i]['Maximum'];
		if (min > time[i]['Minimum']) min = time[i]['Minimum'];
	}
	//console.log("max: "+max.toLocaleDateString());
	//console.log("min: "+min.toLocaleDateString());
	
	for (var year=min.getFullYear();year<=max.getFullYear();year++){
		for (var month=(year==min.getFullYear()?min.getMonth()+1:1);month<=(year==max.getFullYear()?max.getMonth()+1:12);month++){
			var start = 1;
			if (year == min.getFullYear() && month == min.getMonth()+1) start = min.getDate();
			var end = 30;
			if (year == max.getFullYear() && month == max.getMonth()+1) end = max.getDate();
			for (var day=start;day<end;day=Math.floor(day/10)*10+11){
				time_list.push(month+'/'+day+'/'+year);
			}
			
		}
	}
	time_list.push(max.toLocaleDateString());
	//console.log('Generate '+time_list.length);
}


var key_name = 'Author';
/*
function merge_results(results){

	throw err;
	var merge_result = results[0];
	
    for (var i=1;i<results.length;i++){
		for (var j in results[i])
			for (var k in results[i][j][key_name]){
				if (merge_result[j][key_name][k] == undefined)
					merge_result[j][key_name][k] = results[i][j][key_name][k];
				else
					merge_result[j][key_name][k] += results[i][j][key_name][k];
			}
	}
	return merge_result;
}
*/

function merge(post_arr, comment_arr){
	var merge_arr = post_arr;
	for(var i=0; i<merge_arr.length; ++i){
		if(merge_arr[i]['Time'] == comment_arr[i]['Time']){
			for (var id in comment_arr[i][key_name]){
				if (merge_arr[i][key_name][id] == undefined)
					merge_arr[i][key_name][id] = comment_arr[i][key_name][id];
				else{
					merge_arr[i][key_name][id] += comment_arr[i][key_name][id];
				}
			}
		}
		else{
			console.log(i);
			console.log(post_arr.length);
			console.log(comment_arr.length);
			console.log(merge_arr[i]['Time']);
			console.log(comment_arr[i]['Time']);
			console.log("===============");
			throw err;
		}
	}
	return merge_arr;
}


function ranking(source){
	var rank_result = {};

	
	var time_users = [];
	var accumulating_user_num = 0;
	for (var i in source){
		var rank = [],count = 0;
		
		for (var j in source[i][key_name]){
			rank[count] = {};
			rank[count]['author'] = j;
			rank[count]['num'] = source[i][key_name][j];
			count++;
		}
		
		console.log(i+' In ranking: rank(author,num) =>     '+new Date());
		rank = rank.sort(function(a,b){
			return b.num>a.num ? 1 : -1;
		});
		console.log('In ranking: after rank(author,num) =>     '+new Date());
		
		var ranking = 0,last,count = 0;
		for (var index in rank){
			var j = rank[index]['author'];
			
			if (rank_result[j] == undefined){
				accumulating_user_num++;
				
				rank_result[j] = new Array();
				for (var k=0;k<i;k++) rank_result[j].push(-1);
			}
			
			
			if (ranking == 0) rank_result[j].push(++ranking);
			else{
				if (source[i][key_name][j] == last){
					rank_result[j].push(ranking);
					count++;
				}
				else{
					rank_result[j].push(ranking+count+1);
					ranking = ranking+count+1;
					count = 0;
				}
			}
			last = source[i][key_name][j];
			
			for (var k=parseInt(i)+1;k<source.length;k++){
				if (source[k][key_name][j] == undefined) source[k][key_name][j] = 0;
			}
		}
		console.log('In ranking: push result(author,num) => '+new Date());
		time_users.push(accumulating_user_num);
	}
	

	classify(rank_result,time_users);
	return rank_result;
}

function classify(authors,time_users){
	var high = [],medium = [],low = [];
	console.log('Start classifying:'+new Date());
	for (var i in authors){
		var p1 = p2 = -1;
		for (var j=0;j<authors[i].length;j++){
			console.log(i+' '+time_list[j]+' '+authors[i][j]);
			if (authors[i][j] == -1) continue;
			if (authors[i][j] > time_users[j]/5) p1 = j;
			if (authors[i][j] > time_users[j]/3){
				p2 = j;
				break;
			}
		}

		if (p1 == -1) high.push(i);
		else if (p2 == -1) medium.push(i);
		else low.push(i);
	}
	console.log('HIGH:'+high.length+' '+high);
	console.log('MEDIUM:'+medium.length+' '+medium);
	console.log('LOW:'+low.length+' '+low);
}


function handle_result(tmp){
	var v1='Time',v2='Author';
	
	console.log("map 1 "+new Date());
	tmp = tmp.map(function(obj){
		obj[v1] = obj[v1].toLocaleDateString();
		obj[v2] = [obj[v2]];
		return obj;
	});

	console.log("sort "+new Date());
	tmp.sort(function(a,b){
		a_t = Date.parse(a[v1]);
		b_t = Date.parse(b[v1]);
		return a_t-b_t;
	});
	var index = 0;
	console.log("map 2 "+new Date());
	tmp = tmp.map(function(obj){
		obj_t = Date.parse(obj[v1]);
		if(obj_t < Date.parse(time_list[index+1])){
			obj[v1] = time_list[index];
		}
		else{
			for(var i=index+1; i<time_list.length-1; ++i){
				if(obj_t < Date.parse(time_list[i+1]))	break;
			}
			index = i;
			obj[v1] = time_list[index];
		}
		return obj;
	});

	console.log("reduce "+new Date());

	index = 0;
	tmp = tmp.reduce(function(last, now){
		if(last[index] == undefined)
			last = last.concat(now);
		else{
			if(last[index][v1] == now[v1]){
				last[index][v2] = last[index][v2].concat(now[v2]);
			}
			else{
				last = last.concat(now);
				++index;
			}
		}
		return last;
	}, []);

	index = 0;
	log("reduce 2 "+new Date());
	tmp = tmp.reduce(function(last, now){
		var json = {};
		now[v2].forEach(function(each){
			if(json[each] == undefined)
				json[each] = 1;
			else
				++json[each];
		});
		now[v2] = json;
		last = last.concat(now);
		return last;

	}, []);

	return tmp;
}

function log(a){
	console.log(a);
}	
