var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

var PostSchema = new Schema({  
    name: String,
    date: Date,
    creator: String,
    content: String
});

module.exports = mongoose.model('Post', PostSchema);