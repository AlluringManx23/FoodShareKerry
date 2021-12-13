const express = require('express');
const router = express.Router();
const ctrlshop = require('../controllers/shop');
const ctrlfood = require('../controllers/food');

/* Locations pages */
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
