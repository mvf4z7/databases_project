var db = require('../../databases/mysql');
var fs = require('fs');
var async = require('async');
var dateLib = require('../../utilities/dateLib');

module.exports.queryDocuments = function(req, res) {

	// Test if query object is empty, if it is send all documents
	var queryParams = Object.getOwnPropertyNames(req.query);

	var SQL = '\
			   SELECT * \
			   FROM Document \
			   NATURAL JOIN Uploaded';

	if(queryParams.length === 0 ) {
		db.getConnection(function(err, connection) {
			var query = connection.query(SQL, function(err, result) { // SELECT * FROM Document
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
		var query = connection.query(SQL + ' WHERE ' + clause, values, function(err, result) { // SELECT * FROM Document WHERE
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
	var file = req.files.file;

	// for testing
	/*
	req.body.name = 'this_is_a_name';
	req.body.teacher_name = 'Dan Lin';
	req.body.CID = 'CS 3800';
	req.body.season = 'Spring';
	req.body.year = '2005';
	req.body.grade = 35;
	req.body.username = 'abc123';
	*/
	// end of testing data;

	var values = {
		name : req.body.name,
		DOU : dateLib.getDate(),
		teacher_name : req.body.teacher_name,
		CID : req.body.CID,
		season : req.body.season,
		year : req.body.year,
		type_flag : 'A',
		grade : req.body.grade,
		digitalform : null
	};

	async.series([
		function(callback) {
			db.getConnection(function(err, connection) {
				var query = connection.query('INSERT INTO Document SET ?', values, function(err, result) {
					connection.release();
					if(err) {
						console.log('Error inserting upload into Document tables!');
						return callback(err);
					}
					else {
						DID = result.insertId;
						console.log('Successfully uploaded document with DID = ' + DID);
						return callback(null, DID);
					}
				});
			});
		}
	],
	function(err, results) {
		if(err) {
			res.send({error : err});
		}
		else {
			var DID = results[0];
			db.getConnection(function(err, connection) {
				var query = connection.query('INSERT INTO Uploaded VALUES(?, ?)', [req.body.username, DID], function(err, result) {
					if(err) {
						console.log('Error inserting into Uploaded table, data will be deleted from Document table');
						connection.query('DELETE FROM Document WHERE DID = ?', DID);
						res.send({error : err});
					}
					else {
						// Move uploaded file from uploads to course_documents directory
						fs.rename(file.path, './course_documents/' + DID + '.pdf');
						res.send('success');
					}
					connection.release();
				});
			});
		}
	});
};

module.exports.deleteDocument = function(req, res, DID) {
	async.series([
		function(callback) {
			db.getConnection(function(err, connection) {
				var query = connection.query('DELETE FROM Post WHERE DID = ?', DID, function(err, result) {
					connection.release();
					if(err) {
						return callback(err);
					}
					else {
						return callback(null, result);
					}
				});
			});
		},
		function(callback) {
			db.getConnection(function(err, connection) {
				var query = connection.query('DELETE FROM Comment WHERE DID = ?', DID, function(err, result) {
					connection.release();
					if(err) {
						return callback(err);
					}
					else {
						return callback(null, result);
					}
				});
			});
		},
		function(callback) {
			db.getConnection(function(err, connection) {
				var query = connection.query('DELETE FROM Uploaded WHERE DID = ?', DID, function(err, result) {
					connection.release();
					if(err) {
						return callback(err);
					}
					else {
						return callback(null, result);
					}
				});
			});
		},
		function(callback) {
			db.getConnection(function(err, connection) {
				var query = connection.query('DELETE FROM Document WHERE DID = ?', DID, function(err, result) {
					connection.release();
					if(err) {
						return callback(err);
					}
					else {
						return callback(null, result);
					}
				});
			});
		},
	],
	function(err, results) {
		if(err) {
			res.send({error : err});
		}
		else {
			fs.unlink('./course_documents/' + DID + '.pdf', function(err) {
				if(!err) {
					console.log('Document deleted: DID = ' + DID);
				}
				res.send('success');
			});
		}
	});
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
		var timeStamp = dateLib.getDateTime();

		comment = {
			DID : DID,
			time_stamp : timeStamp,
			content : comment.content,
			anonymous : comment.anonymous
		};

		var post = {
			DID : DID,
			time_stamp : timeStamp,
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
						return callback(err);
					}
					else {
						return callback(null, 'Post query: ' + query.sql);
					}
				});
			}
		], 
		function(err, results) {
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










