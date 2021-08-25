const loginService = require('../services/loginService');
const constants = require('../../constants');
const { userNotFound,serverError } = require('../../constants');

const loginController = {
    
    logar: async (req, res)=>{
       
        try {

            let result = await loginService.findUser(req);
         
            if(!result)
                return res.status(404).json({message:userNotFound});
            
            res.status(200).json({message:result})
            

        } catch (error) {
                res.status(500).json({message: serverError})
        }
    }

}


module.exports = loginController;