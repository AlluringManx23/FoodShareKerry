const express = require('express');
const router = express.Router();
const ctrlshop = require('../controllers/shop');
const ctrlfood = require('../controllers/food');

<<<<<<< HEAD
/* shop pages */
=======
/* Locations pages */
>>>>>>> f0eaa051b5a436959bcf2ce1a6176745b1a6b403
router.get('/', ctrlfood.homelist);

router
  .route('/shop')
  .get(ctrlshop.shoplist);
  
router
  .route('/shop/new')
  .get(ctrlshop.addShop)
  .post(ctrlshop.doAddShop);

router
  .route('/shop/:shopid/food/new')
  .get(ctrlfood.addFood)
  .post(ctrlfood.doAddFood);

router.get('/shop/:shopid', ctrlshop.locationInfo);
// /* Other pages */
// router.get('/about', ctrlOthers.about);

module.exports = router;
