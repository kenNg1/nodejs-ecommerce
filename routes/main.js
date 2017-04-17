var router = require('express').Router();

//router or app is acceptable

router.get('/', function(req,res){
  res.render('main/home');
});

router.get('/about', function(req,res){
  res.render('main/about');
});

module.exports = router;
