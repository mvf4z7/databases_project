var db = require('../../databases/mysql');
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
	db.getConnection(function(err, connection) {
		var query = connection.query('DELETE FROM Student WHERE username = ?', username, function(err, result) {
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


