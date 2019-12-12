const express = require('express');
const router = express.Router();
const user = require('../Controllers/userController')


/* GET users listing. */
router.get('/', user.list);
router.post('/new', user.addUser);
router.post('/enable/:id', user.enableUser);
router.post('/disable/:id', user.disableUser);


module.exports = router;
