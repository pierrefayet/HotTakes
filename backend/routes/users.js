const express = require('express');
const router = express.Router();
const app = express();
const checkPassword = require('../middlewares/checkPasswordValidator')
const emailValidator = require('../middlewares/ctrlValidator')

const userCtrl = require('../controllers/user');

router.post('/signup', emailValidator, checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
