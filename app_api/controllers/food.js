const mongoose = require('mongoose');
const food = mongoose.model('Food');
const shop = mongoose.model('Shop');

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
      .findById(req.params.foodid)
      .populate('_shopId')
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

const foodReadAll = function (req, res) {
    food
      .find()
      .populate('_shopId')
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
  };

  const foodListByDistance = function (req, res) {
    var lng = parseFloat(req.body.lng);
    var lat = parseFloat(req.body.lat);
    food
    .find()
      .populate('_shopId')
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
        var locations = [];
        Food.forEach(food => {
          var meters = 0;
          var rawdistance = Math.sqrt(Math.pow((lng - food._shopId.coords[0]),2)+Math.pow((lat - food._shopId.coords[1]),2));
          while(rawdistance >= 0.001452)
          {
            rawdistance = rawdistance - 0.001452;
            meters = meters+100;
          }

          locations.push({
            _id:food._id,
            name:food.name,
            description:food.description,
            experation:food.experation,
            price:food.price,
            _shopId:food._shopId,
            distance:meters});
        });
        res.status(200).json(locations);
      });
  };

const foodReadAllFromShop = function (req, res) {
  if (req.params && req.params.shopid) {
    food
      .find({_shopId:req.params.shopid})
      .exec((err, Food) => {
        if (!Food) {
          res	
            .status(404) 
            .json({	
              "message": "ShopId not found"
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
  if (req.params.shopid || req.params.foodid) {
    food
    .findById(req.params.foodid) 
    .exec((err, Food) => {
      if (err) {
        res
        .status(404)
        .json(err);
        return;
        }
      else if(req.params.shopid == Food._shopId) {
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
        );}
      else
      {
        res
        .status(403)
        .json({
          "message": "Shopid doesn't match Foodid"
        });
        return;
      }
    });
  }
  else{
    res
      .status(404)
      .json({
        "message": "Foodid and Shopid Are both Required"
      });
  }
}

module.exports = {
  foodCreate,
  foodRead,
  foodReadAll,
  foodReadAllFromShop,
  foodListByDistance,
  foodUpdate,
  foodDelete
};
