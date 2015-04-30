var db = require('../../databases/mysql');
var fs = require('fs');
var async = require('async');

module.exports.addStudent = function(req, res) {
	var student = req.body.student;
	var majors = req.body.majors;
	var minors = req.body.minors;

	function insertStudent(callback) {
		db.getConnection(function(err, connection) {
			var query = connection.query('INSERT INTO Student SET ?', student, function(err, result) {
				connection.release();

				if(err) {
					console.log("error in insertStudent");
					return callback(err);
				}
				else {
					console.log("insertStudent Success");
					err = null;
					return callback(null, 'insertStudent Success');
				}
			});
		});
	}

	function insertMajors(callback) {
		db.getConnection(function(err, connection) {

			function insertMajor(major, cb) {
				var row = {username : student.username, major : major};
				var query = connection.query('INSERT INTO Majors SET ?', row, function(err, result) {
					if(err) {
						console.log('insertMajor error');
						return cb(err);
					}
					else {
						console.log('insertMajor Success');
						return cb();
					}
				});
			}

			async.eachSeries(majors, insertMajor, function(err) {
				connection.release();
				if(err) {
					return callback(err);
				}
				else {
					return callback(null, 'insertMajors Success');
				}
			});
		});
	}

	function insertMinors(callback) {
		db.getConnection(function(err, connection) {

			function insertMinor(minor, cb) {
				var row = {username : student.username, minor : minor};
				var query = connection.query('INSERT INTO Minors SET ?', row, function(err, result) {
					if(err) {
						console.log('insertMinor error');
						return cb(err);
					}
					else {
						console.log('insertMinor Success');
						return cb();
					}
				});
			}

			async.eachSeries(minors, insertMinor, function(err) {
				connection.release();
				if(err) {
					return callback(err);
				}
				else {
					return callback(null, 'insertMinors Success');
				}
			});
		});
	}

	async.series([
		insertStudent,
		insertMajors,
		insertMinors
	], function(err, results) {
		if(err) {
			console.log('Final callback, in error');
			db.getConnection(function(err, connection) {
				var query = connection.query('DELETE FROM Student WHERE username = ?', student.username);
				query = connection.query('DELETE FROM Majors WHERE username = ?', student.username);
				query = connection.query('DELETE FROM Minors WHERE username = ?', student.username);
			});

			return res.send({error : err});
		}
		else {
			console.log('final callback, in success');
			return res.send('Success');
		}
	});
};

module.exports.getSingleStudent = function(req, res, username) {
	function getStudentInfo(callback) {
		db.getConnection(function(err, connection) {
			var query = connection.query('SELECT * FROM Student WHERE username = ?' , username, function(err, result) {
				connection.release();
				console.log("student info:");
				console.log(result);
				if(err) {
					return callback(err);
				}
				else {
					return callback(null, result);
				}
			});
		});
	}

	function getMajors(callback) {
		db.getConnection(function(err, connection) {
			var query = connection.query('SELECT DISTINCT major FROM Majors WHERE username = ?', username, function(err, result) {
				connection.release();
				console.log('getMajors result');
				console.log(result);
				if(err) {
					return callback(err);
				}
				else {
					return callback(null, result);
				}
			});
		});
	}

	function getMinors(callback) {
		db.getConnection(function(err, connection) {
			var query = connection.query('SELECT DISTINCT minor FROM Minors WHERE username = ?', username, function(err, result) {
				connection.release();
				console.log('getMinors result:');
				console.log(result);
				if(err) {
					return callback(err);
				}
				else {
					return callback(null, result);
				}
			});
		});
	}

	async.series([
		getStudentInfo,
		getMajors,
		getMinors
	],
	function(err, results) {
		if(err) {
			res.send({error : err});
		}
		else {
			var studentInfo = results[0];
			var majorsQuery = results[1];
			var minorsQuery = results[2];

			var majors = [];
			majorsQuery.forEach(function(result) {
				majors.push(result.major);
			});

			var minors = [];
			minorsQuery.forEach(function(result) {
				minors.push(result.minor);
			});

			studentInfo[0].majors = majors;
			studentInfo[0].minors = minors;

			console.log(majors);
			console.log(minors);
			console.log('studentinfo');
			console.log(studentInfo);
			res.send({result : studentInfo});
		}
	});
};

module.exports.updateStudent = function(req, res, username) {
	db.getConnection(function(err, connection) {
		updates = req.body.updates;

		var query = connection.query('UPDATE Student SET ? WHERE username = ?', [updates, username], function(err, result) {
			if(err) {
				res.send({error : err});
			}
			else {
				res.send('success');
			}
			connection.release();
		});

		console.log(query.sql);
	});
};

module.exports.deleteStudent = function(req, res, username) {
	DIDs = []; commentPairs = [];
	async.series([
		function(callback) {
			db.getConnection(function(err, connection) {
				var SQL = '\
						  SELECT DID \
						  FROM Document \
						  NATURAL JOIN Uploaded \
						  WHERE Uploaded.username = ?';

				var query = connection.query(SQL, username, function(err, result) {
					connection.release();
					if(err) {
						return callback(err);
					}
					else {
						result.forEach(function(row) {
							DIDs.push(row.DID);
						});
						console.log(DIDs);
						return callback();
					}
				});
				console.log(query);
			});
		},
		function(callback) {
			db.getConnection(function(err, connection) {
				var query = '';
				query = connection.query('DELETE FROM Post WHERE username = ? or DID in (?)', [username, DIDs]); console.log(query.sql);
				query = connection.query('DELETE FROM Comment WHERE DID in (?)', [DIDs]); console.log(query.sql);
				query = connection.query('DELETE FROM Uploaded WHERE username = ?', username); console.log(query.sql);
				query = connection.query('DELETE FROM Document WHERE DID in (?)', [DIDs]); console.log(query.sql);
				query = connection.query('DELETE FROM Minors WHERE username = ?', username); console.log(query.sql);
				query = connection.query('DELETE FROM Majors WHERE username = ?', username); console.log(query.sql);
				query = connection.query('DELETE FROM Student WHERE username = ?', username); console.log(query.sql);
				connection.release();
				callback(null, 'DELETE success');
			});
		},
		function(callback) {
			db.getConnection(function(err, connection) {
				var query = connection.query('SELECT DID, time_stamp FROM Post NATURAL RIGHT JOIN Comment WHERE username IS NULL', function(err, result) {
					connection.release();
					if(err) {
						return callback(err);
					}
					else {
						commentPairs = result;
						return callback();
					}
				});
				console.log(query.sql);
			});
		},
		function(callback) {
			db.getConnection(function(err, connection) {

				function deleteCommentPair(pair, cb) {
					var query = connection.query('DELETE FROM Comment WHERE DID = ? and time_stamp = ?', [pair.DID, pair.time_stamp], function(err, result) {
						if(err) {
							return cb(err);
						}
						else {
							return cb();
						}
					});
				}

				async.eachSeries(commentPairs, deleteCommentPair, function(err) {
					connection.release();
					if(err) {
						return callback(err);
					}
					else {
						return callback();
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
			DIDs.forEach(function(DID) {
				fs.unlink('./course_documents/' + DID + '.pdf', function(err) {
					if(!err) {
						console.log('Document deleted: DID = ' + DID);
					}
				});
			});
			res.send('success');
		}
	});
};

module.exports.getAllDocuments = function(req, res, username) {
	db.getConnection(function(err, connection) {
		var SQL = '\
				  SELECT * \
				  FROM Document \
				  NATURAL JOIN Uploaded \
				  WHERE Uploaded.username = ?';

		var query = connection.query(SQL, username, function(err, result) {
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

module.exports.getAllComments = function(req, res, username) {
	db.getConnection(function(err, connection) {
		var SQL = '\
				   SELECT * \
				   FROM Post \
				   NATURAL JOIN	Comment \
				   WHERE Post.username = ?';

		var query = connection.query(SQL, username, function(err, result) {
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


