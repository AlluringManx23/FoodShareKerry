const express = require('express');
const router = express.Router();
const ctrlShop = require('../controllers/shop');

router
  .route('/shop')
  .get(ctrlShop.shopReadAll)
  .post(ctrlShop.shopCreate);

router
  .route('/shop/:shopid')
  .get(ctrlShop.shopRead)
  .put(ctrlShop.shopUpdate)
  .delete(ctrlShop.shopDelete);

module.exports = router;