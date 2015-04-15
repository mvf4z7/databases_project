/* Code included by default
var mongoose = require('mongoose');  
var Post = require('../../models/post');

module.exports.addPost = function(req, res) {
	var post = new Post(req.body.post);
	post.save(function(err){
		if(err){
			res.send(err);
		}
		res.json({post: post});
	});
};

module.exports.getAllPosts = function(req, res) {};

module.exports.getSinglePost = function(req, res, id) {};

module.exports.updatePost = function(req, res, id) {};

module.exports.deletePost = function(req, res, id) {}; 
*/