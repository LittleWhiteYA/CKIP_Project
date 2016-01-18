
function time_query(table){
	var q = 'SELECT MAX(Time) as Maximum,MIN(Time) as Minimum FROM ';
	var query2 = '';

	for (var i in table){
		if(table[i]['Tables_in_project'].length<=5)
			continue;
		if(table[i]['Tables_in_project'].indexOf('ptt') >= 0)
			continue;
		else if(i == table.length-2)
			query2 += (q+table[i]['Tables_in_project']);
		else 
			query2 +=(q+table[i]['Tables_in_project'].toString()+ ' UNION ');
	}
	return query2;
}

/*
function get_category(table){
	var category = [];
	for (var i in table){
		var tmp = table[i]['Tables_in_project'], len;
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
*/

function generate_time_arr(time, time_list){
	var max = new Date('2000-01-01'),min = new Date('2015-12-20');
	for (var i in time){
		if (max < time[i]['Maximum']) max = time[i]['Maximum'];
		if (min > time[i]['Minimum']) min = time[i]['Minimum'];
	}
	console.log("max: "+max.toLocaleDateString());
	console.log("min: "+min.toLocaleDateString());
	
	for (var year=min.getFullYear();year<=max.getFullYear();year++){
		for (var month=(year==min.getFullYear()?min.getMonth()+1:1);month<=(year==max.getFullYear()?max.getMonth()+1:12);month++){
			var start = 1;
			if (year == min.getFullYear() && month == min.getMonth()+1) start = min.getDate();
			var end = 30;
			if (year == max.getFullYear() && month == max.getMonth()+1) end = max.getDate();
			for (var day=start;day<end;day=Math.floor(day/10)*10+11){
				time_list.push(new Date(month+'/'+day+'/'+year));
			}
			
		}
	}
	console.log('Generate '+time_list.length);
	return time_list;
}

function log(a, b){
	console.log("a: "+a);
	console.log("b: "+b);
}	

exports.time_query = time_query;
//exports.get_category = get_category;
exports.generate_time_arr = generate_time_arr;


