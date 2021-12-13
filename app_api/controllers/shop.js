const mongoose = require('mongoose');
const food = mongoose.model('Food');
const shop = mongoose.model('Shop');

// EXPOSED METHODS

const shopCreate = function (req, res) {
  if(!req.body.lng || !req.body.lat)
  {
    var lng = 0;
    var lat = 0;
  }
  else{
    var lng = req.body.lng;
    var lat = req.body.lat
  }
  shop.create({
    name: req.body.name,
    address: req.body.address,
    coords: [lng, lat],
    days: req.body.days,
    openingtime: req.body.openingtime,
    closingtime: req.body.closingtime,
    closed: req.body.closed
  }, (err, Shop) => {
    if (err) {
      res
        .status(400)
        .json(err);
    } else {
      res
        .status(201)
        .json(Shop);
    }
  });
};

const shopReadAll = function (req, res) {
    shop
      .find()
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
        res		
          .status(200)
          .json(Shop);
      });
};

const shopRead = function (req, res) {
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
        res		
          .status(200)
          .json(Shop);
      });
  } else {		
    res		
      .status(404) 	
      .json({	
        "message": "No Shopid in request"
      });		
  }
};

const shopUpdate = function (req, res) {
  if (!req.params.shopid) {
    res
      .status(404)
      .json({
        "message": "Not found, locationid is required"
      });
    return;
  }
  shop
    .findById(req.params.shopid)
    .select()
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
          .status(400)
          .json(err);
        return;
      }
      var lng = Shop.coords[0];
      var lat = Shop.coords[1];
      if(!req.body.name){Shop.name = Shop.name;}else{Shop.name = req.body.name;}
      if(!req.body.address){Shop.address = Shop.address;}else{Shop.address = req.body.address;}
      if(req.body.lng){lng = req.body.lng;}if(req.body.lat){lat = req.body.lat;}
      Shop.coords = [lng,lat];
      if(!req.body.days){Shop.days = Shop.days;}else{Shop.days = req.body.days;}
      if(!req.body.openingtime){Shop.openingtime = Shop.openingtime;}else{Shop.openingtime = req.body.openingtime;}
      if(!req.body.closingtime){Shop.closingtime = Shop.closingtime;}else{Shop.closingtime = req.body.closingtime;}
      if(!req.body.closed){Shop.closed = Shop.closed;}else{Shop.closed = req.body.closed;}
      Shop.save((err, Shop) => {
        if (err) {
          res
            .status(404)
            .json(err);
        } else {
          res
            .status(200)
            .json(Shop);
        }
      });
    }
  );
};

const shopDelete = function (req, res) {
  if (req.params.shopid) {
    food
      .remove({_shopId:req.params.shopid}) 
      .exec((err, Food) => {
          if (err) {
            res
              .status(404)
              .json(err);
            return;
          }
          shop
          .findByIdAndRemove(req.params.shopid) 
          .exec((err, Shop) => {
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
        );
        }
    );
  } else {
    res
      .status(404)
      .json({
        "message": "No locationid"
      });
  }
};
 
// PRIVATE HELPER METHODS

const _doAddReview = function(req, res, location) {
  if (!location) {
    res
      .status(404)
      .json({
        "message": "locationid not found"
      });
  } else {
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    location.save((err, location) => {
      if (err) {
        console.log(err);
        res
          .status(400)
          .json(err);
      } else {
        _updateAverageRating(location._id);
        let thisReview = location.reviews[location.reviews.length - 1];
         res
           .status(201)
           .json(thisReview);
      }
    });
  }
};

const _updateAverageRating = function(locationid) {
  Loc
    .findById(locationid)
    .select('rating reviews')
    .exec((err, location) => {
      if (!err) {
        _doSetAverageRating(location); 
      }
    });
};

const _doSetAverageRating = function(location) {
  if (location.reviews && location.reviews.length > 0) {
    const reviewCount = location.reviews.length;
    let ratingTotal = 0;
    for (let i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
    let ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
};


module.exports = {
  shopCreate,
  shopRead,
  shopUpdate,
  shopDelete,
  shopReadAll
};
