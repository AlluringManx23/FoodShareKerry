const express = require('express');
const router = express.Router();
const ctrlShop = require('../controllers/shop');
const ctrlFood = require('../controllers/food');

// locations
router
  .route('/shop')
  //get(ctrlShop.shopListByAmount)
  .post(ctrlShop.shopCreate);

router
  .route('/shop/:shopid')
  .get(ctrlShop.shopRead)
  .put(ctrlShop.shopUpdate)
  .delete(ctrlShop.shopDelete);
  
// reviews
router
  .route('/shop/:shopid/food')
  .post(ctrlFood.foodCreate);

router
  .route('/shop/:shopid/food/:foodid')
  .get(ctrlFood.foodRead)
  .put(ctrlFood.foodUpdate)
  .delete(ctrlFood.foodDelete);

module.exports = router;
