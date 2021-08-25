const express = require('express')
const router = express.Router();
const loginController = require('./api/controllers/loginController')
router.get('/',(req, res)=>{
    res.send('oi')
})
router.post('/login',loginController.logar)
// router.get('/create',loginController.read)
// router.get('/update',loginController.read)
// router.get('/login',loginController.read)

module.exports = router