const loginService = require('../services/loginService');
const constants = require('../../constants');
const { userNotFound,serverError } = require('../../constants');
const loginController = {
    
    logar:(req, res)=>{
       
        try {

            let result = loginService.findUser(req)
            if(!result)
                return res.status(204).json({message:userNotFound})

        } catch (error) {
                res.status(500).json({message: serverError})
        }
    }

}


module.exports = loginController;