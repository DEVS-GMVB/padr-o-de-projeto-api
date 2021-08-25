const express = require('express')
const router = express.Router();
const loginController = require('./api/controllers/loginController')

//Autenticação route
router.post('/login',loginController.logar)

// router.get('/user',loginController.read)
// router.post('/user',loginController.create)
// router.put('/user',loginController.update)
// router.delete('/user',loginController.delete)

module.exports = router