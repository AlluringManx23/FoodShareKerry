const request = require('request');
const apiOptions = {
  server : 'https://foodsharekerry.herokuapp.com'
};

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
          console.log(data[i].distance);
          data[i].distance = _formatDistance(data[i].distance);
        }
      }
      _renderHomepage(req, res, data);
    }
  );
};

/* GET 'Location info' page */
const locationInfo = function(req, res){
  _getShopInfo(req, res, (req, res, shopData) => {
    console.log(shopData);
  _getFoodInfo(req, res, (req, res, foodData) => {
    console.log(foodData);
    _renderDetailPage(req, res, shopData ,foodData);
  }
);
});
}

/* GET 'Add review' page */
const addShop = function(req, res){
    _renderAddShopForm(req, res);
};

const doAddShop = function(req, res) {
  const path = `/api/shop/`;
  const postdata = {
    name: req.body.shop_name,
    address: req.body.shop_address,
    lng: req.body.shop_lng,
    lat: req.body.shop_lat,
    days: req.body.shop_opendays,
    opening: req.body.shop_opening,
    closing:req.body.shop_closing,
    closed:req.body.shop_open
  };
  console.log(postdata)
  const requestOptions = {
    url : apiOptions.server + path,
    method : 'POST',
    json : postdata
  };
    request(
      requestOptions,
      (err, response, body) => {
        if (response.statusCode === 201) {
          res.redirect(`/location/${body._id}`);
        }else {
          _showError(req, res, response.statusCode);
        }
      }
    );
};

// PRIVATE METHODS
const _getShopInfo = function(req, res, callback) {
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
        data.coords = {
          lng : body.coords[0],
          lat : body.coords[1]
        };                                
        callback(req, res, data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

const _getFoodInfo = function(req, res, callback) {
  const path = `/api/shop/${req.params.shopid}/food`;
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
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
    shops: responseBody,
    message: message
  });
};

const _renderDetailPage = function(req, res, shopData,foodData) {
  res.render('shop-info', {
    title: shopData.name,
    pageHeader: {
      title: shopData.name
    },
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    shop: shopData,
    foods: foodData
  });
};

const _renderAddShopForm = function(req, res) {
  res.render('add-shop-form', {
    title: `Add New Shop`,
    pageHeader: { title: `New Shop` },
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
  addShop,
  doAddShop
};
