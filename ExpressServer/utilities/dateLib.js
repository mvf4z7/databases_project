
var getDate = function() {
	var date = new Date();
	var year = date.getFullYear();
	var month = (date.getMonth() + 1).toString();
	var day = date.getDate().toString();

	if(month.length === 1) {
		month = '0' + month;
	}
	if(day.length === 1) {
		day = '0' + day;
	}

	return (year + '-' + month + '-' + day);
};

var getDateTime = function() {
	var date = new Date();

	var hours = date.getHours().toString();
	var minutes = date.getMinutes().toString();
	var seconds = date.getSeconds().toString();

	if(hours.length === 1) {
		hours = '0' + hours;
	}
	if(minutes.length === 1) {
		minutes = '0' + minutes;
	}
	if(seconds.length === 1) {
		seconds = '0' + seconds;
	}

	return (getDate() + ' ' + hours + ':' + minutes + ':' + seconds);
};

module.exports = {
	getDate : getDate,
	getDateTime : getDateTime
};
