// require Express
var express = require('express');

// 實例化一個 Express物件
var app = express();

app.get('/index.html', function(req, res){
	res.send('hello express!');

	console.log("req: ");
	console.log(req);
	console.log("==============");
	console.log("res: ");
	console.log(res);
	res.end();
});





// 建立 Http Server 同時監聽 1337 port
app.listen(3000, function () {
	console.log('ready on port 3000');
});


console.log("Server start: "+new Date());
