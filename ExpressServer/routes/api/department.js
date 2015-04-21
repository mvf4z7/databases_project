var db = require('../../databases/mysql');

module.exports.getAllDepartments = function(req, res) {
	db.getConnection(function(err, connection) {
		var query = connection.query('SELECT * FROM Department', function(err, result) {
			if(err) {
				res.send(err);
			}
			else {
				res.send({result : result});
			}
			connection.release();
		});
	});
};

module.exports.addDepartment = function(req, res) {
	var department = req.body.department;

	department = {
		Dname : department.name,
		Dnumber : department.number,
		Mgr_ssn : department.mgrSSN,
		Mgr_start_date : department.mgrStartDate
	};

	db.getConnection(function(err, connection) {
		var query = connection.query('INSERT INTO Department SET ?', department, function(err, result) {
			if(err) {
				res.send(err);
			}
			else {
				res.send('sucess');
			}
			connection.release();
		});

		console.log(query.sql);
	});
};

module.exports.getCourses = function(req, res, abbreviation) {
	db.getConnection(function(err, connection) {

		var SQL = '\
				  SELECT C.id, C.CID, O.dept_abbreviation \
				  FROM Class C, Offered_By O \
				  WHERE C.CID = O.CID and dept_abbreviation = ?';

		var query = connection.query(SQL, abbreviation, function(err, result) {
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
}







