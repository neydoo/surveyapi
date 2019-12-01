const express = require("express");
const router = express.Router();
const auth = require('../Controllers/authController')

router.post('/login' , auth.login)
router.post('/register' , auth.register)
router.get('/test' , (req,res)=>{
    res.send('nice')
})



module.exports = router