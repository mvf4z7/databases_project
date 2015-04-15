var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('*', function(req, res, next) {
// 	res.sendFile('/Users/mvf4z7/Google Drive/School/spring2015(Rolla)/databases/project/ExpressServer/public/front_end/index.html');
// });


module.exports = router;
