const express = require('express');
const router = express.Router();
const ctrlFood = require('../controllers/food');

router
  .route('/food')
  .get(ctrlFood.foodReadAll)
  .post(ctrlFood.foodListByPrice);

router
  .route('/shop/food')
  .post(ctrlFood.foodListByDistance);

router
  .route('/shop/:shopid/food')
  .get(ctrlFood.foodReadAllFromShop)
  .post(ctrlFood.foodCreate);

router
  .route('/shop/:shopid/food/:foodid')
  .get(ctrlFood.foodRead)
  .put(ctrlFood.foodUpdate)
  .delete(ctrlFood.foodDelete);

module.exports = router;
