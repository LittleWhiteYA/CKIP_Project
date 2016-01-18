var mysql = require('mysql');
var async = require('async');

var table_list = ['mi','samsung','htc','iphone'];
var time_array = [];
var lastest_time = new Date('2001-12-01'),oldest_time = new Date('2015-12-01');

var connection = mysql.createConnection({
	host:'140.116.245.134',
	user:'project',
	password:'00000000',
	database:'project'
});

var query = 'SELECT MAX(Time) as Maximum, MIN(Time) as Minimum FROM Post_';
var query1 = 'SELECT Time,Content FROM Post_';
var query2 = 'SELECT Time,Content FROM Comment_';

async.eachSeries(table_list, function(item,callback){
	connection.query(query+item ,function(err,rows,fields){
		if (err) throw err;
		lastest_time = rows[0]['Maximum']>lastest_time ? rows[0]['Maximum'] : lastest_time;
		oldest_time = rows[0]['Minimum']<oldest_time ? rows[0]['Minimum'] : oldest_time;
		console.log('lastest_time='+lastest_time);
		console.log('oldest_time='+oldest_time);
		callback(null,'pass');
	});
}, function (err,results){
	async.waterfall([
		function(callback){
			connection.query('SHOW TABLES',function(err,rows,fields){
				if (err) throw err;
				console.log('Set Time Array');
				
				var period = 10;
				var p_num = Math.floor(30/period);
				var merge = Math.round(p_num-oldest_time.getDate()/period);
				time_array.push(oldest_time);
		
				var year = oldest_time.getFullYear();
				var month = oldest_time.getMonth()+1;
				for (var i=1;i<merge;i++)
					time_array.push(new Date(year+'-'+month+'-'+(period*(p_num-merge+i)+1)));
				for (var i=month+1;i<=12;i++){
					for (var j=0;j<p_num;j++)
						time_array.push(new Date(year+'-'+i+'-'+(j*period+1)));
				}
				for (var i=year+1;i<lastest_time.getFullYear();i++){
					for (var j=1;j<=12;j++){
						for (var k=0;k<p_num;k++)
							time_array.push(new Date(i+'-'+j+'-'+(k*period+1)));
					}
				}
				merge = Math.round(lastest_time.getDate()/period);
				year = lastest_time.getFullYear();
				month = lastest_time.getMonth()+1;
				for (var i=1;i<month;i++){
					for (var j=0;j<p_num;j++){
						time_array.push(new Date(year+'-'+i+'-'+(j*period+1)));
					}
				}
				for (var i=0;i<merge;i++){
					time_array.push(new Date(year+'-'+month+'-'+(i*period+1)));
				}
				time_array.push(lastest_time);
				for (var i=0;i<time_array.length;i++)
					console.log('time_array['+i+']='+time_array[i].getFullYear()+' '+(time_array[i].getMonth()+1)+' '+time_array[i].getDate());
			
				callback(null,'one');
			});
		},
		function(arg1,callback){
			for (var t in table_list){
				var word_list = {};
				async.parallel([
					function(next){
						connection.query(query1+table_list[t],function(err,rows,fields){
							for (var i in rows){
								if (rows[i]['Content'] === undefined) continue;
								var words = rows[i]['Content'].split(' ');
								console.log('Doing '+i+'/'+rows.length+'...'+Object.keys(word_list).length);
								for (var j in words){
									if (words[j].lastIndexOf('-') < 0) continue;
									if (words[j].substring(words[j].lastIndexOf('-')+1) == 'N' || words[j].substring(words[j].lastIndexOf('-')+1) == 'FW'){
										for (var k=0;k<time_array.length-1;k++){
											if (rows[i]['Time'] < time_array[k+1] && rows[i]['Time'] >= time_array[k]){
												if (word_list[words[j].substring(0,words[j].lastIndexOf('-'))] === undefined) word_list[words[j].substring(0,words[j].lastIndexOf('-'))] = [];
												word_list[words[j].substring(0,words[j].lastIndexOf('-'))].push(k);
												break;
											}
										}
									}
								}
							}
							console.log('Post Done');
							next(null,'pass');
						});
					},
					function(next){
						connection.query(query2+table_list[t],function(err,rows,fields){
							for (var i in rows){
								var words = rows[i]['Content'].split(' ');
								console.log('Doing '+i+'/'+rows.length+'...');
								for (var j in words){
									if (words[j].lastIndexOf('-') < 0) continue;
									if (words[j].substring(words[j].lastIndexOf('-')+1) == 'N' || words[j].substring(words[j].lastIndexOf('-')+1) == 'FW'){
										for (var k=0;k<time_array.length-1;k++){
											if (rows[i]['Time'] < time_array[k+1] && rows[i]['Time'] >= time_array[k]){
												if (word_list[words[j].substring(0,words[j].lastIndexOf('-'))] === undefined) word_list[words[j].substring(0,words[j].lastIndexOf('-'))] = [];
												word_list[words[j].substring(0,words[j].lastIndexOf('-'))].push(k);
												break;
											}
										}
									}
								}
							}
							console.log('Comment Done');
							next(null,'pass');
						});
					}
				],function(err,results){
					connection.query('SHOW TABLES',function(err,rows,fields){
						console.log('Merge Table');
						var word_table = new Object();
						for (var i in word_list){
							var empty = [];
							for (var j=0;j<time_array.length-1;j++)
								empty.push(0);
							word_list[i] = empty;
						}
						if (err) throw err;
						for (var i in word_list){
							for (var j in word_list[i]){
								if (word_table[i] === undefined){
									var empty = [];
									for (var k=0;k<time_array.length-1;k++)
										empty.push(0);
									word_list[i] = empty;
								}
								word_table[i][word_list[i][j]]++;
							}
						}
					});
					if (t == table_list.length-1)callback(null,'pass');
				});
			}
		}
	],function(err,results){
		connection.end();
	});
});
