const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlOthers = require('../controllers/others');

/* Locations pages */
router.get('/', ctrlLocations.homelist);

router
  .route('/shop/new')
  .get(ctrlLocations.addShop)
  .post(ctrlLocations.doAddShop);

router.get('/shop/:shopid', ctrlLocations.locationInfo);
// /* Other pages */
// router.get('/about', ctrlOthers.about);

module.exports = router;
