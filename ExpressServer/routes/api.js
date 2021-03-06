var express = require('express');
var router = express.Router();
var multer = require('multer');

var departments = require('./api/department');
var students = require('./api/student');
var documents = require('./api/document');
var classes = require('./api/class');
var stats = require('./api/stats');

/* Departments Routes */
router.route('/departments')
	.get(function(req, res) { departments.getAllDepartments(req, res) })
	.post(function(req,res) { departments.addDepartment(req,res) });

/* Single Department Routes */
router.route('/departments/:abbreviation/courses')
	.get(function(req, res) { departments.getCourses(req, res, req.params.abbreviation) });

/* Classes Route */
router.route('/classes')
	.get(function(req, res) { classes.getAllClasses(req, res) });

/* Single Class Routes */
router.route('/classes/:id/teachers')
	.get(function(req, res) { classes.getClassTeachers(req, res, req.params.id) });

/* Students Routes */
router.route('/students')
	.post(function(req, res) { students.addStudent(req, res) }); // Creates new user

/* Single Student Routes */
router.route('/students/:username')
	.get(function(req, res) { students.getSingleStudent(req, res, req.params.username) }) // Get a user's info
	.put(function(req,res) { students.updateStudent(req, res, req.params.username) }) // Update a user's info
	.delete(function(req, res) { students.deleteStudent(req, res, req.params.username) }); // Delete a user from the system

router.route('/students/:username/documents')
	.get(function(req, res) { students.getAllDocuments(req, res, req.params.username) });

router.route('/students/:username/comments')
	.get(function(req, res) { students.getAllComments(req, res, req.params.username) });

/* Documents Routes */
router.route('/documents')
	.get(function(req, res) { documents.queryDocuments(req, res) })
	.post([multer({ dest: './uploads/'}), function(req, res) { documents.uploadDocument(req, res) }]);

/* Single Document Routes */
router.route('/documents/:DID')
	.get(function(req, res) { documents.getSingleDocument(req, res, req.params.DID) })
	.put(function(req, res) { documents.updateDocument(req, res, req.params.DID) })
	.delete(function(req, res) { documents.deleteDocument(req, res, req.params.DID) });

router.route('/documents/:DID/download')
	.get(function(req, res) { documents.downloadDocument(req, res, req.params.DID) });

router.route('/documents/:DID/comments')
	.get(function(req, res) { documents.getDocumentComments(req, res, req.params.DID) })
	.post(function(req, res) { documents.postDocumentComment(req, res, req.params.DID) });

/* Routes for User Statistics */
router.route('/stats/votes')
	.get(function(req, res) { stats.getVotesSum(req, res) });


module.exports = router;  




