var express = require('express');
var router = express.Router();
var multer = require('multer');

//var posts = require('./api/post');
var departments = require('./api/department');
var students = require('./api/student');
var documents = require('./api/document');


/* Posts routes */
/* Code included by default
router.route('/posts')  
    .post(function(req,res) { posts.addPost(req,res) })
    .get(function(req,res) { posts.getAllPosts(req,res) });
*/

/* Single post routes */
/* Code included by default
router.route('/posts/:post_id')  
    .get(function(req, res) { posts.getSinglePost(req, res, req.params.post_id) })
    .put(function(req, res) { posts.updatePost(req, res, req.params.post_id) })
    .delete(function(req, res) { posts.deletePost(req, res, req.params.post_id) });
*/

/* Departments Routes */
router.route('/departments')
	.get(function(req, res) { departments.getAllDepartments(req, res) })
	.post(function(req,res) { departments.addDepartment(req,res) });

router.route('/departments/:abbreviation/courses')
	.get(function(req, res) { departments.getCourses(req, res, req.params.abbreviation) });

/* Students Routes */
router.route('/students')
	.post(function(req, res) { students.addStudent(req, res) }); // Creates new user

/* Single Student Routes */
router.route('/students/:username')
	.get(function(req, res) { students.getSingleStudent(req, res, req.params.username) }) // Get a user's info
	.put(function(req,res) { students.updateStudent(req, res, req.params.username) }) // Update a user's info
	.delete(function(req, res) { students.deleteStudent(req, res, req.params.username) }); // Delete a user from the system

/* Documents Routes */
router.route('/documents')
	.get(function(req, res) { documents.queryDocuments(req, res) })
	.post([multer({ dest: './uploads/'}), function(req, res) { documents.uploadDocument(req, res) }]);

/* Single Document Routes */
router.route('/documents/:DID')
	.get(function(req, res) { documents.getSingleDocument(req, res, req.params.DID) })
	.put(function(req, res) { documents.updateDocument(req, res, req.params.DID) });

/* Document Download Routes */
router.route('/documents/:DID/download')
	.get(function(req, res) { documents.downloadDocument(req, res, req.params.DID) });

/* Document Comments Route*/
router.route('/documents/:DID/comments')
	.get(function(req, res) { documents.getDocumentComments(req, res, req.params.DID) })
	.post(function(req, res) { documents.postDocumentComment(req, res, req.params.DID) });

// Need routes for
// /documents?teacher=lin
// semester, teacher, year, class, department

// get all departments. classes, teachers, years, semester

module.exports = router;  




