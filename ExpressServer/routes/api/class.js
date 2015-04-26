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

module.exports.getClassTeachers = function(req, res, id) {
	db.getConnection(function(err, connection) {
		var sql = '\
				  SELECT T.teacher_name \
				  FROM Class C, Teaches T \
				  WHERE C.id = ? and C.CID = T.CID'
				  
		var query = connection.query(sql, id, function(err, result) {
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