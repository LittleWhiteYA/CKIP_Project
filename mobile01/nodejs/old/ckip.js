var mysql = require('mysql');

var db_config = {
    host: '140.116.245.134',
    user: 'project',
    password: '00000000',
    database: 'project'
};

var connection = mysql.createConnection(db_config);
var posts = [];
var comments = [];

connection.connect(function(err){
	if(err){
		console.log('error when connecting to db!', err);
	}
});


var str = "mi";
connection.query('SELECT * FROM '+"Post_"+str,function(error, result1){

    if(error){
        console.log('error in query Post! ',error);
    }
    posts = result1;
});

connection.query('SELECT * FROM '+"Comment_"+str,function(error, result2){

    if(error){
        console.log('error in query Comment! ',error);
    }
    comments = result2;
	start();
});


function start(){
	
	var noun_arr = [];
	str = posts[10]['Content'];
	noun_arr = str.split(' ').filter(function(val){
			val = val.split('-');
			return val[1]=='N';
	});
	noun_arr = noun_arr.map(function(val){
			val = val.split('-');
			return val[0];
	});
	noun = noun_arr.reduce(function(last, now){
		console.log("l: "+last);
		console.log("n: "+now);
		if(last[now] == undefined)
			last[now] = 1;
		else
			++last[now];
		console.log(last);	
		return last;	

	});

	console.log(noun_arr);
	console.log(noun);


	
}



connection.end(function(err){
	if(err){
		console.log('connect end error!');
	}

});
