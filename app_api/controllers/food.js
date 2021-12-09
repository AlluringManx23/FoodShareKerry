const mongoose = require('mongoose');
const food = mongoose.model('Food');
const shop = mongoose.model('Shop');

const _buildLocationList = function(req, res, results, stats) {
  let locations = [];
  results.forEach((doc) => {
    locations.push({
      distance: doc.dis,
      name: doc.obj.name,
      address: doc.obj.address,
      rating: doc.obj.rating,
      facilities: doc.obj.facilities,
      _id: doc.obj._id
    });
  });
  return locations;
};

const locationsListByDistance = function (req, res) {
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const maxDistance = parseFloat(req.query.maxDistance);
  const point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  const geoOptions = {
    spherical: true,
    maxDistance: 20000,
    num: 10
  };
  if ((!lng && lng !==0 ) || (!lat && lat !== 0) || !maxDistance) {
    console.log('locationsListByDistance missing params');
    res
      .status(404)
      .json({
        message : 'lng, lat and maxDistance query parameters are all required'
      });
    return;
  }
  Loc.geoNear(point, geoOptions, (err, results, stats) => {
    const locations = _buildLocationList(req, res, results, stats);
    console.log('Geo Results', results);
    console.log('Geo stats', stats);
    res
      .status(200)
      .json(locations);
  });
};

const foodCreate = function (req, res) {
  if (req.params && req.params.shopid) {
    shop
      .findById(req.params.shopid)
      .exec((err, Shop) => {
        if (!Shop) {
          res	
            .status(404) 
            .json({	
              "message": "Shopid not found"
            });	 
          return;
        } else if (err) {
          res	
            .status(404) 
            .json(err); 
          return; 	
        }
        food.create({
          name: req.body.name,
          description: req.body.description,
          experation:req.body.experation,
          price:req.body.price,
          _shopId: req.params.shopid
          }, (err, Food) => {
          if (err) {
            res
              .status(400)
              .json(err);
          } else {
            res
              .status(201)
              .json(Food);
          }
        });
      });
  } else {		
    res		
      .status(404) 	
      .json({	
        "message": "No Shopid in request"
      });		
  }
};

const foodRead = function (req, res) {
  if (req.params && req.params.foodid) {
    food
      .find(req.params.foodid)
      .exec((err, Food) => {
        if (!Food) {
          res	
            .status(404) 
            .json({	
              "message": "foodid not found"
            });	 
          return;
        } else if (err) {
          res	
            .status(404) 
            .json(err); 
          return; 	
        }
        res		
          .status(200)
          .json(Food);
      });
  } else {		
    res		
      .status(404) 	
      .json({	
        "message": "No Shopid in request"
      });		
  }
};

const foodUpdate = function (req, res) {
  if (!req.params.foodid) {
    res
      .status(404)
      .json({
        "message": "Not found, locationid is required"
      });
    return;
  }
  food
    .findById(req.params.foodid)
    .select('-_shopId')
    .exec((err, Food) => {
      if (!Food) {
        res
          .json(404)
          .status({
            "message": "locationid not found"
          });
        return;
      } else if (err) {
        res
          .status(400)
          .json(err);
        return;
      }
      Food.name = req.body.name;
      Food.description = req.body.description;
      Food.price = req.body.price;
      Food.experation = req.body.experation;
      Food.save((err, food) => {
        if (err) {
          res
            .status(404)
            .json(err);
        } else {
          res
            .status(200)
            .json(food);
        }
      });
    }
  );
};

const foodDelete = function (req, res) {
  if (!req.params.shopid || !req.params.foodid) {
    res
      .status(404)
      .json({
        "message": "Not found, foodid and shopid are both required"
      });
    return;
  }
  food
          .findByIdAndRemove(req.params.foodid) 
          .exec((err, Food) => {
              if (err) {
                res
                  .status(404)
                  .json(err);
                return;
              }
              res
                .status(204)
                .json(null);
            }
        )
        else {
        res
          .status(404)
          .json({
            "message": "No review to delete"
          });
      }
    }
  );
};

module.exports = {
  foodCreate,
  foodRead,
  foodUpdate,
  foodDelete
};
