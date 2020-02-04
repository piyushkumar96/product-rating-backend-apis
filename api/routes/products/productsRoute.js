/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/product-rating-backend-apis
* 
*   This file contains products addition, updation routes
 **************************************************************************/

'use strict';

module.exports = function (app) {

   const productsController = require('../../controllers/products/productsCntrl'),
      authentication = require('../../middleware/auth');

   // add product route
   app.route('/api/v1/addProduct')
      .post(authentication.auth, productsController.addProduct)

   // get the product
   app.route('/api/v1/getProduct/:prodId')
      .get(authentication.auth, productsController.getProduct)

   // get all the products
   app.route('/api/v1/getAllProducts')
      .get(authentication.auth, productsController.getAllProducts)

   // get all the products available
   app.route('/api/v1/getAllProductsAvail')
      .get(authentication.auth, productsController.getAllProductsAvail)

   //update the product's discount price
   app.route('/api/v1/updateDiscntPrice')
      .patch(authentication.auth, productsController.updateDiscntPrice)

   //update the product's quantity 
   app.route('/api/v1/updateProdQty')
   .patch(authentication.auth, productsController.updateProdQty)
      
   //update the product's status
   app.route('/api/v1/updateProdStatus')
      .patch(authentication.auth, productsController.updateProdStatus)

   //create an order for renting a product
   app.route('/api/v1/rentProduct')
      .patch(authentication.auth, productsController.rentProduct)

   //for rating a product
   app.route('/api/v1/rateProduct')
      .patch(authentication.auth, productsController.rateProduct)

   //for getting avg rating of a product
   app.route('/api/v1/getProdAvgRating/:prodId')
      .get(authentication.auth, productsController.getProdAvgRating)

   //for getting all ratings of a product
   app.route('/api/v1/getAllRatings/:prodId')
      .get(authentication.auth, productsController.getAllRatings)

};
