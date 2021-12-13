const request = require('request');
const apiOptions = {
  server : 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://foodsharekerry.herokuapp.com';
}
// PUBLIC EXPOSED METHODS

/* GET 'home' page */
const shoplist = function(req, res){
  const path = '/api/shop';
  const requestOptions = {
    url : apiOptions.server + path,
    method : 'GET',
    json : {
      lng : -9.687677621841432,
      lat : 52.27999373266711}
  };
  request(
    requestOptions,
    (err, response, body) => {
      let data = body;
      console.log(data);
      if (response.statusCode === 200 && data.length) {
        for (let i = 0; i < data.length; i++) {
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
    openingtime: req.body.shop_opening,
    closingtime:req.body.shop_closing,
    closed:req.body.shop_open
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
          res.redirect(`/shop`);
        }else if(response.statusCode === 400 && body.name && body.name === 'ValidationError'){
          res.redirect(`/shop/new?err=val`);
        }
        else {
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
  res.render('shop-list', {
    title: 'Food-Share',
    pageHeader: {
      title: 'Food-Share',
      strapline: 'Promoting a circular economy'
    },
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
    shop: shopData,
    foods: foodData
  });
};

const _renderAddShopForm = function(req, res) {
  console.log(req.query.err);
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
  shoplist,
  locationInfo,
  addShop,
  doAddShop
};
