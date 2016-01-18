
function rate(callback){
	var mysql = require('mysql');
	var timejs = require('./time');

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

	var query3 = 'SELECT Time,Author,PosOrNeg FROM ';
	var time_list = [];

	connection.query('Show TABLES', function(err, table_list){
		if(err)
			console.log('err!');
		var query2 = timejs.time_query(table_list);
		connection.query(query2, function(err, time){
			if(err)
				log("query2 err "+ err);
			//log(time);
			timejs.generate_time_arr(time, time_list);
			select_table(table_list, function(returnValue){
				callback(returnValue);
			});
			
		});
	});


	function select_table(table, callback){
		category = ['htc', 'iphone', 'mi', 'samsung'];
		var result_list = [];
		for(var i=0; i<category.length; ++i){
			log(i+" "+category[i]);
			connection.query(query3+'Post_'+category[i],function(error, result){
				if(error){
					console.log('error in query Post! ',error);
				}
				console.log('Post query start '+new Date());
				var tmp = handle_result(result);
				result_list.push(tmp);
				console.log('Post query end '+new Date());
			});
			
			connection.query(query3+'Comment_'+category[i],function(error, result){
				if(error){
					console.log('error in query Comment! ',error);
				}
				console.log('Comment query start '+new Date());
				var tmp = handle_result(result);
				result_list.push(tmp);
				console.log('Comment query end '+new Date());
				log("=======================");
			});
			/*
			connection.query('show tables', function(error, result){
				if(error)
					console.log('error in show tables');
				console.log("tables "+new Date());
			});
			*/
			//break;
		}
		connection.end(function(err){
			if(err)
				console.log("connection end error!");
			
			log("merge start "+new Date());
			log(result_list.length);
			var merge_table = {};
			for(var i=0, num=0; i<result_list.length; i=i+2, ++num){
				var tmp = merge(result_list[i], result_list[i+1]);
				if(category[num] == 'ptt')
					++num;
				merge_table[ category[num] ] = tmp;
			}
			//console.log(merge_table);
			
			console.log("connect end: "+new Date());
			//log(merge_table);
			callback(merge_table);
		});
	}

	function merge(post_arr, comment_arr){
		var merge_arr = [];
		var index = 0;
		for(var i=0, index=i; i<post_arr.length; ++i, ++index){

			while(post_arr[i]['Time'] != comment_arr[index]['Time']){
				log("post and comment not same! add index!");
				log(post_arr[i]['Time']);
				log(comment_arr[index]['Time']);
				++index;
			}
			
			var json = {};
			if(post_arr[i]['Time'] == comment_arr[index]['Time']){
				json['Time'] = post_arr[i]['Time'];
				merge_id = post_arr[i]['total_id']+comment_arr[index]['total_id'];
				merge_pos = post_arr[i]['positive']+comment_arr[index]['positive'];
				merge_neg = post_arr[i]['negative']+comment_arr[index]['negative'];
				merge_neu = post_arr[i]['neutral']+comment_arr[index]['neutral'];
				json['total_id'] = merge_id;
				json['total_positive'] = merge_pos;
				json['total_negative'] = merge_neg;
				json['total_neutral'] = merge_neu;

				json['Rate'] = merge_pos/merge_id*100;
				merge_arr.push(json);
			}
			else{
				log("post and comment time not same! "+i);
				log(post_arr[i]['Time']);
				log(comment_arr[index]['Time']);
			}
		}
		//log(merge_arr);
		return merge_arr;
	}


	function handle_result(tmp){

		var v1='Time', v2='Author', v3='PosOrNeg';

		console.log('map '+new Date());
		tmp = tmp.map(function(obj){
			obj[v1] = obj[v1].toLocaleDateString();
			obj[v3] = parseInt(obj[v3]);
			return obj;
		});
		throw err;
		
		console.log('sort '+new Date());
		tmp.sort(function(a,b){
			a_t = Date.parse(a[v1]);
			b_t = Date.parse(b[v1]);
			return a_t-b_t;
		});
		console.log('sort_end '+new Date());
		
		var index = 0;
		log('map 2 '+new Date());
		tmp = tmp.map(function(obj){
			obj_t = Date.parse(obj[v1]);
			if (obj_t < Date.parse(time_list[index+1])){
				obj[v1] = time_list[index];
			}
			else{
				for (var i=index+1;i<time_list.length-1;i++){
					if (obj_t < Date.parse(time_list[i+1])){
						index = i;
						obj[v1] = time_list[index];
						break;
					}
				}
			}
			return obj;
		});
		log('map 2 end '+new Date());

		log('reduce start '+new Date());
		index = 0;
		tmp = tmp.reduce(function(last, now){

			//first time
			if(last[index] == undefined){
				last[index] = {};
				last[index][v1] = now[v1];
				last[index][v2] = {};
				last[index][v2][ now[v2] ] = now[v3];
			}
			else{
				if(last[index][v1] == now[v1]){
					if(last[index][v2][ now[v2] ] == undefined)
						last[index][v2][ now[v2] ] = now[v3];
					else
						last[index][v2][ now[v2] ] += now[v3];
				}
				else{
					++index;
					last[index] = {};
					last[index][v1] = now[v1];
					last[index][v2] = {};
					last[index][v2][ now[v2] ] = now[v3];
				}
			}
			return last;
		}, []);
		log('reduce end '+new Date());

		log('map 3 start '+new Date());
		tmp = tmp.map(function(obj){
		
			obj['total_id'] = Object.keys(obj['Author']).length;
			obj['positive'] = 0;
			obj['negative'] = 0;
			obj['neutral'] = 0;
			for(var authr in obj['Author']){
				rank = obj['Author'][authr];
				if(rank > 0)
					++obj['positive'];
				else if(rank < 0)
					++obj['negative'];
				else if(rank == 0)
					++obj['neutral'];
			}
			return obj;			
		});
		log('map 3 end '+new Date());
		return tmp;
	}
}

exports.rate = rate;
rate();
function log(a){
	console.log(a);
}


