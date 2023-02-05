const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multerCfg');
const SauceCtrl = require('../controllers/sauce');



router.get('/', auth, SauceCtrl.getAllSauces);
router.post('/', auth, multer, SauceCtrl.createSauce);
router.get('/:id', auth, SauceCtrl.getOneSauce);
router.put('/:id', auth, multer, SauceCtrl.modifySauce);
router.delete('/:id', auth, SauceCtrl.deleteSauce);
router.post('/:id/like', auth, SauceCtrl.likesAndDislikes);

module.exports = router;
