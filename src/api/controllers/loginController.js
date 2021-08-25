const loginService = require('../services/loginService');
const constants = require('../../constants');
const { userNotFound,serverError } = require('../../constants');
const loginController = {
    
    create:  (req,res) => {
    
        try {

            let result = loginService.create(req)
            if(!result)
                return res.status(204).json({message:userNotFound})
        } catch (error) {
                res.status(500).json({message: serverError})
        }
    },

    logar:(req, res)=>{
            console.log(req)
        // try {

        //     let result = loginService.read(req)
        //     if(!result)
        //         return res.status(204).json({message:userNotFound})

        // } catch (error) {
        //         res.status(500).json({message: serverError})
        // }
    },

    update:(req, res)=>{

    },

    delete:(req, res)=>{

    }

}


module.exports = loginController;