function news(connection, callback){
	var mysql = require('mysql');
	var timejs = require('./time');
	//建立連線
/*
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
*/
	//var time_list = [];
	connection.query('Show tables', function(err, table_list){
		if(err)	log('err in show tables!');
		var query2 = timejs.time_query(table_list);
		var time_list = [];
		connection.query(query2, function(err, time){
			if(err) log("query err! "+err);
			timejs.generate_time_arr(time, time_list);
		});
		var json = {};
		type = ['htc', 'iphone', 'samsung', 'mi'];
		var index = 0;
		
		for(var num in type){
			connection.query('select Title,Time from News where Source = ?',type[num], function(err, result){
				if(err)	log(err);
				json[type[index]] = handle_result(result, time_list);
				++index;
				//log(json);
			});
			//break;
		}
		
		var key_arr = ['蔡英文', '蔡 英文', '空心菜', '陳建仁',
						'朱 立倫', '朱立倫', '王如玄',
						'宋 楚瑜', '宋楚瑜', '徐欣瑩']
		var arr1 = [], arr2 = [], arr3 = [];
		connection.query('select Title,Time,Content from News where Source = "policy"', function(err, result){
			if(err)	log(err);
			//log(result);
			log("select news "+new Date());
			for(var row_n in result){
				for(var index=0; index<key_arr.length; ++index){
					if(result[row_n]['Content'].indexOf(key_arr[index]) != -1)
					{
						if(index <= 3){
							arr1.push(result[row_n]);
							index = 3;
						}
						else if(index > 3 && index <= 6){
							arr2.push(result[row_n]);
							index = 6;
						}
						else if(index > 6){
							arr3.push(result[row_n]);
							break;
						}
					}
				}
			}
			json['蔡英文'] = handle_result(arr1, time_list);
			json['朱立倫'] = handle_result(arr2, time_list);
			json['宋楚瑜'] = handle_result(arr3, time_list);
			log("select news end "+new Date());
		});
		/*
		connection.end(function(err){
			if(err)	log(err);
			log(json);
			callback(json);
		});
		*/
		connection.query('show tables', function(err, result){
			if(err)	throw err;
			callback(json);
		});
	});







	function handle_result(result, time_list){

		result.sort(function(a, b){
			return Date.parse(a['Time'])-Date.parse(b['Time']);
		});
		var index = 0;

		result = result.map(function(obj){
			obj_t = Date.parse(obj['Time']);
			if(obj_t < Date.parse(time_list[index+1]))
				obj['Time'] = time_list[index].toLocaleDateString();
			else{
				for(var i=index+1; i<time_list.length; ++i){
					if(obj_t < Date.parse(time_list[i+1])){
						index = i;
						obj['Time'] = time_list[index].toLocaleDateString();
						break;
					}
					
				}
				if(index == time_list.length-2 && obj_t >= Date.parse(time_list[time_list.length-1]) && obj_t < Date.parse(time_list[time_list.length-1])+10*86400*1000)
					obj['Time'] = time_list[time_list.length-1].toLocaleDateString();

			}
			return obj;
		});
		index = 0;
		result = result.reduce(function(last, now){
			if(last[index] == undefined){
				last[index] = {};
				last[index]['Time'] = now['Time'];
				last[index]['Title'] = [];
				last[index]['Title'].push(now['Title']);
			}
			else{
				if(last[index]['Time'] == now['Time']){
					last[index]['Title'].push(now['Title']);
				}
				else if(Date.parse(now['Time']) > Date.parse(time_list[time_list.length-1]))
				{
					
				}
				else{
					++index;
					last[index] = {};
					last[index]['Time'] = now['Time'];
					last[index]['Title'] = [];
					last[index]['Title'].push(now['Title']);
				}
			}
			return last;
		}, []);
		
		return result;	
	}
}

//news();
exports.news = news;



























function log(a){
	console.log(a);
}
