const request = require('request');
const apiOptions = {
  server : 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://foodsharekerry.herokuapp.com';
}

// PUBLIC EXPOSED METHODS

/* GET 'home' page */
const homelist = function(req, res){
  const path = '/api/food';
  const requestOptions = {
    url : apiOptions.server + path,
    method : 'POST',
    json : {
      lng : -9.687677621841432,
      lat : 52.27999373266711,
      maxDistance : 20}
  };
  request(
    requestOptions,
    (err, response, body) => {
      let data = body;
      if (response.statusCode === 200 && data.length) {
        for (let i = 0; i < data.length; i++) {
          data[i].distance = _formatDistance(data[i].distance);
          data[i].experation = _formatDate(data[i].experation);
        }
      }
      _renderHomepage(req, res, data);
    }
  );
};

/* GET 'Location info' page */
const locationInfo = function(req, res){
  _getLocationInfo(req, res, (req, res, responseData) => {
    _renderDetailPage(req, res, responseData);
  });
};

/* GET 'Add review' page */
const addFood = function(req, res){
  _getFoodInfo(req, res, (req, res, responseData) => {
    _renderReviewForm(req, res, responseData);
  });
};

const doAddFood = function(req, res) {
  const shopid = req.params.shopid;
  const path = `/api/shop/${shopid}/food`;
  const postdata = {
    name: req.body.food_name,
    description: req.body.food_description,
    price: req.body.food_price,
    experation: req.body.food_experation,
  };
  const requestOptions = {
    url : apiOptions.server + path,
    method : 'POST',
    json : postdata
  };
    request(
      requestOptions,
      (err, response, body) => {
        if (response.statusCode === 201) {
          res.redirect(`/shop/${shopid}`);
        } else if (response.statusCode === 400 && body.name && body.name === 'ValidationError' ) {
          res.redirect(`/shop/${shopid}/food/new?err=val`);
        } else {
          _showError(req, res, response.statusCode);
        }
      }
    );
};

// PRIVATE METHODS
const _getFoodInfo = function(req, res, callback) {
  const path = `/api/shop/${req.params.shopid}`;
  const requestOptions = {
    url : apiOptions.server + path,
    method : 'GET',
    json : {}
  };
  request(
    requestOptions,
    (err, response, body) => {
      let data = body;
      if (response.statusCode === 200) {
        callback(req, res, data);                         
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

const _renderHomepage = function(req, res, responseBody){
  let message = null;
  if (!(responseBody instanceof Array)) {
    message = 'API lookup error';
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = 'No food found nearby';
    }
  }
  res.render('food-list', {
    title: 'Food Share - Promoting a circular economy',
    pageHeader: {
      title: 'Food Share',
      strapline: 'Promoting a circular economy'
    },
    shops: responseBody,
    message: message
  });
};

const _renderDetailPage = function(req, res, locDetail) {
  res.render('location-info', {
    title: locDetail.name,
    pageHeader: {
      title: locDetail.name
    },
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: locDetail
  });
};

const _renderReviewForm = function(req, res, shopDetails) {
  res.render('add-food-form', {
    title: `Add new food for ${shopDetails.name}`,
    pageHeader: { title: `Add Food for ${shopDetails.name}` },
    error: req.query.err
  });
};

const _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const _formatDistance = function (distance) {
  if (distance && _isNumeric(distance)) {
    let thisDistance = 0;
    let unit = 'm';
    if (distance > 1000) {
      thisDistance = parseFloat(distance / 1000).toFixed(1);
      unit = 'km';
    } else {
      thisDistance = Math.floor(distance);
    }
    return thisDistance + unit;
  } else {
    return '?';
  }
};

const _formatDate = function (distance) {
  var date = distance.split('-');
  return date[2].split('T')[0]+'/'+date[1]+'/'+date[0];
};

const _showError = function (req, res, status) {
  let title = '';
  let content = '';
  if (status === 404) {
    title = '404, page not found';
    content = 'Oh dear. Looks like we can\'t find this page. Sorry.'; 
  } else {
    title = `${status}, something's gone wrong`;
    content = 'Something, somewhere, has gone just a little bit wrong.';
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};



module.exports = {
  homelist,
  locationInfo,
  addFood,
  doAddFood
};