var express = require('express');
var router = express.Router();
var passport = require('passport');

const loginController = require("../controllers/login.controller.js");
const userController = require("../controllers/users.controller.js");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', loginController.login);
router.post('/get_messages', userController.get_messages);

router.get('/users', isAuthenticated,  userController.user_list);

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});



router.post('/', passport.authenticate('local-signin_user', {
    successRedirect: '/users',
    failureRedirect: '/',
    failureFlash: true
}),
    function (req, res, next) {
        res.render('/', {
            'error': req.flash('message')
        });
    });
module.exports = router;

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}



module.exports = router;
