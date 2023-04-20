const models = require('../models')
const { Op } = require("sequelize");

exports.get_messages = async (req, res) => {
    try{
        var messageList = await models.Messages.findAll({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            { sender_id: req.body.sender }, 
                            { receiver_id:  req.body.receiver}
                        ]
                    },
                    {
                        [Op.and]: [
                            { sender_id: req.body.receiver }, 
                            { receiver_id: req.body.sender }
                        ]
                    }
                ]
            }
        });

        res.json({message: messageList})

    }catch(e){
        console.log("error in get messages >>", e)
    }
};

exports.user_list = async (req, res) => {
    try{
        let userId = req.user.id;
        var usersList = await models.User.findAll({
          where: {
            id: {
              [Op.ne]: userId
            }
          },
        });
      
        // console.log("userLists >>", usersList)
        res.render('users', {usersList, userId})
    }catch(e){
        console.log("error user list ", e)
    }
}