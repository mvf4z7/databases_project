var db = require('../../databases/mysql');

module.exports.getVotesSum = function(req, res) {
	db.getConnection(function(err, connection) {
		var SQL = '\
				   SELECT username, SUM(votes) AS votes \
				   FROM Document d, Uploaded u \
				   WHERE d.DID = u.DID \
				   GROUP BY username \
				   ORDER BY SUM(votes) DESC';

		var query = connection.query(SQL, function(err, result) {
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