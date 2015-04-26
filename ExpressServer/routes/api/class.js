var db = require('../../databases/mysql');

module.exports.getAllClasses = function(req, res) {
	db.getConnection(function(err, connection) {
		var query = connection.query('SELECT * FROM Class', function(err, result) {
			connection.release();
			if(err) {
				res.send({error : err});
			}
			else {
				res.send({result : result});
			}
		});
		console.log(query.sql);
	});
};