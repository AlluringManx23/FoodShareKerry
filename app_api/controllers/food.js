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

  const foodListByPrice = function (req, res) {
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
        var foodsUnsorted = [];
        Food.forEach(food => {
          var meters = 0;
          var rawdistance = Math.sqrt(Math.pow((lng - food._shopId.coords[0]),2)+Math.pow((lat - food._shopId.coords[1]),2));
          while(rawdistance >= 0.001452)
          {
            rawdistance = rawdistance - 0.001452;
            meters = meters+100;
          }
          foodsUnsorted.push({
            _id:food._id,
            name:food.name,
            description:food.description,
            experation:food.experation,
            price:food.price,
            _shopId:food._shopId,
            distance:meters});
        });
        foodsUnsorted.sort(GetSortOrder("price"));
        res.status(200).json(foodsUnsorted);
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
        var foodsUnsorted = [];
        Food.forEach(food => {
          var meters = 0;
          var rawdistance = Math.sqrt(Math.pow((lng - food._shopId.coords[0]),2)+Math.pow((lat - food._shopId.coords[1]),2));
          while(rawdistance >= 0.001452)
          {
            rawdistance = rawdistance - 0.001452;
            meters = meters+100;
          }
          foodsUnsorted.push({
            _id:food._id,
            name:food.name,
            description:food.description,
            experation:food.experation,
            price:food.price,
            _shopId:food._shopId,
            distance:meters});
        });
        foodsUnsorted.sort(GetSortOrder("distance"));
        res.status(200).json(foodsUnsorted);
      });
  };

function GetSortOrder(prop) {    
  return function(a, b) {    
    if (a[prop] > b[prop]) {    
      return 1;    
    } else if (a[prop] < b[prop]) {    
      return -1;    
    }    
      return 0;    
  }    
}

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
      if(!req.body.name){Food.name = Food.name}else{Food.name = req.body.name};
      if(!req.body.description){Food.description = Food.description}else{Food.description = req.body.description};
      if(!req.body.price){Food.price = Food.price}else{Food.price = req.body.price};
      if(!req.body.experation){Food.experation = Food.experation}else{Food.experation = req.body.experation};
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
          .status(200)
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
  foodListByPrice,
  foodListByDistance,
  foodUpdate,
  foodDelete
};
