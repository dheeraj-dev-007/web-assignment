var passport = require('passport');
const models = require('../models')
var LocalStrategy = require('passport-local');
var url = require('url');
var crypto = require('crypto');


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done){
    var userData = await models.User.findOne({
        where: { id: id },
    })

    done(null, userData);
});



passport.use('local-signin_user', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},  async function (req, username, password, done){
        if(!username || !password ) { 
            return done(null, false, req.flash('error','All fields are required.')); 
        }
        
        var userExists = await models.User.findOne({
            where: { email: username },
        });
        if(userExists){
            var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
            
            salt = salt+''+password;
            var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
            var dbPassword  = userExists.password;
            if(!(dbPassword == encPassword)){
                return done(null, false, req.flash('error','Invalid email or password.'));
            }
            return done(null, userExists);
        }else{
            return done(null, false, req.flash('error','Invalid email or password.')); 
        }
        
    }
));
