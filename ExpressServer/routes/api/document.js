var db = require('../../databases/mysql');
var fs = require('fs');
var async = require('async');

module.exports.queryDocuments = function(req, res) {

	// Test if query object is empty send all documents
	var queryParams = Object.getOwnPropertyNames(req.query);
	if(queryParams.length === 0 ) {
		db.getConnection(function(err, connection) {
			var query = connection.query('SELECT * FROM Document', function(err, result) {
				if(err) {
					res.send({error : err});
				}
				else {
					res.send({result : result});
				}
				connection.release();
			});

			console.log(query.sql);
		});

		return;
	}

	var clause = '';
	var values = [];
	queryParams.forEach(function(param, idx) {
		clause += param + " = ?";
		values.push(req.query[param]);

		if(idx < queryParams.length - 1) {
			clause += ' and ';
		}
	});

	db.getConnection(function(err, connection) {
		var query = connection.query('SELECT * FROM Document WHERE ' + clause, values, function(err, result) {
			if(err) {
				res.send({error : err});
			}
			else {
				res.send({result : result});
			}
			connection.release();
		});

		console.log(query.sql);
	});
};


module.exports.getSingleDocument = function(req, res, DID) {
	db.getConnection(function(err, connection) {
		var query = connection.query('SELECT * FROM Document WHERE DID = ?', DID, function(err, result) {
			if(err) {
				res.send({error : err});
			}
			else {
				res.send({result : result});
			}
			connection.release();
		});

		console.log(query.sql);
	});
};

module.exports.updateDocument = function(req, res, DID) {
	db.getConnection(function(err, connection) {
		var updates = req.body.updates;
		var query = connection.query('UPDATE Document SET ? WHERE DID = ?', [updates, DID], function(err, result) {
			if(err) {
				res.send({error : err});
			}
			else {
				res.send({result : result});
			}
			connection.release();
		});

		console.log(query.sql);
	});
};

module.exports.downloadDocument = function(req, res, DID) {
	var path = './course_documents/' + DID + '.pdf';
	console.log('path: ' + path);
	console.log('cwd: ' + process.cwd());
	
	fs.exists(path, function(exists) {
		if(!exists) {
			res.send({error : 'File does not exist!'});
		}
		else {
			res.download(path, 'report.pdf', function(err) {
				if(err) res.send(err);	
			});
		}
	});
};

module.exports.uploadDocument = function(req, res) {
	console.log('There was an attempt to upload a file');
	console.log('req.files = ' + req.files.toString());

	res.send('success');
};

module.exports.getDocumentComments = function(req, res, DID) {
	db.getConnection(function(err, connection) {
		var SQL =	'\
					SELECT C.DID, C.time_stamp, C.content, C.anonymous, P.username \
					FROM Comment C, Post P \
					WHERE C.DID = P.DID and C.time_stamp = P.time_stamp and C.DID = ?';

		var query = connection.query(SQL, DID, function(err, result) {
			if(err) {
				res.send({error : err});
			}
			else {
				res.send({result : result});
			}
			connection.release();
		});
	});
};

module.exports.postDocumentComment = function(req, res, DID) {
	db.getConnection(function(err, connection) {
		var comment = req.body.comment;
		var username = req.body.username;

		var post = {
			DID : comment.DID,
			time_stamp : comment.time_stamp,
			username : username
		};

		async.series([
			function(callback){
				var query = connection.query('INSERT INTO Comment SET ?', comment, function(err, result) {
					if(err) {
						console.log('Error inserting comment into Comment table.');
						return callback(err);
					}
					else {
						return callback(null, 'Comment query: ' + query.sql);
					}
				});
			},
			function(callback) {
				var query = connection.query('INSERT INTO Post Set ?', post, function(err, result) {
					if(err) {
						console.log('Error insterting comment into Post table.');
						callback(err);
					}
					else {
						return callback(null, 'Post query: ' + query.sql);
					}
				});
			}
		], function(err, results) {
			if(err) {
				var query = connection.query('DELETE FROM Comment WHERE DID = ? and time_stamp = ?', [comment.DID, comment.time_stamp]);
				var query = connection.query('DELETE FROM Post WHERE DID = ? and time_stamp = ? and username = ?', [comment.DID, comment.time_stamp, username]);

				res.send({error : err});
			}
			else {
				console.log(results);
				res.send('Success');
			}
		});
	
		connection.release();
	});
};










