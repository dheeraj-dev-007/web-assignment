const models = require('../models')


exports.login = async (req, res) => {
    try{
        var usersList = await models.User.findAll();
        res.render('login/index', { title: 'Express', error: req.flash('error')});
    }catch(e){
        console.log("error in Login >>", e)
    }
};