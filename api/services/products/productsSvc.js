/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/product-rating-backend-apis
* 
*   This file contains users creation, login, updation main logic
 **************************************************************************/

'use strict';

//External Modules 
const mongoose = require('mongoose');

// Internal Modules
const productsSchema = require('../../models/products/productsModel'),
    logger = require('../../../logger'),
    updateCurrRentedProd = require('../users/usersSvc').updateCurrRentedProd,
    updateUserRatingDetail = require('../users/usersSvc').updateUserRatingDetail,
    counterHlp = require('../../helpers/counters/countersHlp');
// emailHlp = require('../../helpers/email/emailHlp');

const loggerName = "[productsSvc ]: ";

/**
 * Create User
 * @param {String} prodName
 * @param {String} actualPrice
 * @param {String} color
 * @param {String} status
 *
 * @returns {Promise}
 */

exports.addProduct = function (data) {

    return new Promise(async (resolve, reject) => {

        try {
            let prodId = await counterHlp.counters("product", "1")

            let prodName = data.body.prodName,
                actualPrice = data.body.actualPrice,
                discntPrice = actualPrice,
                color = data.body.color,
                status = data.body.status,
                quantity = data.body.quantity;

            let newProduct = new productsSchema({
                prodId: prodId,
                prodName: prodName,
                actualPrice: actualPrice,
                discntPrice: discntPrice,
                color: color,
                status: status,
                quantity: quantity
            })

            newProduct.save(async function (err, product) {
                if (err) {
                    logger.error(loggerName + " Error in addtion of product. " + err)
                    let prodId = await counterHlp.counters("-1")
                    reject("Error in addtion of product.")
                } else {
                    logger.info(loggerName + " Product added successfully @@@")
                    resolve("Product added successfully @@@")
                }
            })

        } catch (err) {
            logger.error(loggerName + err);
            let prodId = await counterHlp.counters("-1")

            reject("Error in addtion of product.");
        }

    });
}


/**
 * get a product by Id 
 * @param {String} prodId
 * 
 * @returns {Promise}
 */

exports.getProduct = function (data) {

    return new Promise(async (resolve, reject) => {

        let prodId = data.params.prodId;

        productsSchema.findOne({
            prodId: prodId
        })
            .exec()
            .then(async (product) => {
                if (product) {
                    logger.info(loggerName + " Product fetched successfully @@@")
                    resolve(product)
                } else {
                    logger.info(loggerName + " Product not found")
                    reject("Product not found")
                }
            })
    });

}


/**
 * get all products
 * 
 * @returns {Promise}
 */

exports.getAllProducts = function (data) {

    return new Promise(async (resolve, reject) => {

        productsSchema.find({
        })
            .exec()
            .then(async (products) => {
                if (products.length != 0) {
                    logger.info(loggerName + " Products fetched successfully @@@")
                    resolve(products)
                } else {
                    logger.info(loggerName + " No products added yet")
                    reject(" No products added yet")
                }
            })
    });

}


/**
 * get all products which are available
 * 
 * @returns {Promise}
 */

exports.getAllProductsAvail = function (data) {

    return new Promise(async (resolve, reject) => {

        productsSchema.find({
            status: "available"
        })
            .exec()
            .then(async (products) => {
                if (products.length != 0) {
                    logger.info(loggerName + " Available products fetched successfully @@@")
                    resolve(products)
                } else {
                    logger.info(loggerName + " No products available")
                    reject(" No products available")
                }
            })
    });

}


/**
 * update discount price of product
 * @param {String} prodId
 * 
 * @returns {Promise}
 */

exports.updateDiscntPrice = function (data) {

    let prodId = data.body.prodId,
        discntPrice = data.body.discntPrice;

    return new Promise(async (resolve, reject) => {

        productsSchema.findOneAndUpdate(
            {
                "prodId": prodId
            },
            {
                $set: {
                    "discntPrice": discntPrice
                }
            },
            {
                upsert: false,
                new: true
            },
            function (err, doc) {
                if (err) {
                    logger.error(loggerName + " Error in updating discounted price " + err)
                    reject(" Error in updating discounted price. Please try again!!!")
                } else {
                    logger.info(loggerName + " Successfully updated discounted price  @@@")
                    resolve("Successfully updated discounted price")
                }
            })
    });

}


/**
 * update Product's quantity
 * @param {String} prodId
 * @param {String} quantity
 * 
 * @returns {Promise}
 */

exports.updateProdQty = function (data) {

    let prodId = data.body.prodId,
        quantity = data.body.quantity;

    return new Promise(async (resolve, reject) => {

        productsSchema.findOneAndUpdate(
            {
                "prodId": prodId
            },
            {
                $set: {
                    "quantity": quantity
                }
            },
            {
                upsert: false,
                new: true
            },
            function (err, doc) {
                if (err) {
                    logger.error(loggerName + " Error in updating quantity of product " + err)
                    reject(" Error in updating quantity of product. Please try again!!!")
                } else {
                    logger.info(loggerName + " Successfully updated quantity  @@@")
                    resolve("Successfully updated quantity")
                }
            })
    });

}


/**
 * update status of product
 * @param {String} prodId
 * 
 * @returns {Promise}
 */

exports.updateProdStatus = function (data) {

    let prodId = data.body.prodId,
        status = data.body.status;

    return new Promise(async (resolve, reject) => {

        productsSchema.findOneAndUpdate(
            {
                "prodId": prodId
            },
            {
                $set: {
                    "status": status
                }
            },
            {
                upsert: false,
                new: true
            },
            function (err, doc) {
                if (err) {
                    logger.error(loggerName + " Error in updating status " + err)
                    reject(" Error in updating status. Please try again!!!")
                } else {
                    logger.info(loggerName + " Successfully updated product's status  @@@")
                    resolve("Successfully updated product's status")
                }
            })
    });

}


/**
 * update product's detail after rent a product 
 * @param {string} prodId
 * @param {Object} quantity
 * 
 * @returns {Promise}
 */

function updateRentedProdDetail(prodId, quantity) {

    return new Promise(async (resolve, reject) => {

        productsSchema.findOneAndUpdate(
            {
                "prodId": prodId
            },
            {
                upsert: false,
                new: true
            }).exec(function (err, doc) {
                if (err) {

                    logger.info(loggerName + " Error in renting product. Product's details update failed " + err)
                    reject(" Error in renting a product. Please try again!!! " + err)
                    
                } else {

                    if (doc.status == "unavailable") {
                        
                        logger.info(loggerName + " Product is unavailable. Pls try after sometime @@@@")
                        resolve("Product is unavailable. Pls try after sometime @@@@");

                    } else {

                        let qty = doc.quantity - quantity;

                        if (qty < 0) {
                            logger.error(loggerName + " Error in renting product. Quantity of product available is less i.e. " + doc.quantity)
                            reject(" Quantity of product available is less i.e. " + doc.quantity);
                        } else {

                            doc.quantity = qty
                            doc.noOfOrderPlaced = doc.noOfOrderPlaced + 1
                            doc.totalQtyOrdered = doc.totalQtyOrdered + quantity

                            if (qty == 0) {
                                doc.status = "unavailable"
                            }

                            doc.save();
                            logger.info(loggerName + " Product's details updated successfully after renting a product @@@")
                            resolve("Product's details updated successfully after renting a product")
                        }
                    }

                }
            })
    });

}


/**
 * rent the product 
 * @param {String} prodId
 * 
 * @returns {Promise}
 */

exports.rentProduct = function (data) {

    let prodId = data.body.prodId,
        prodName = data.body.prodName,
        quantity = data.body.quantity,
        price = data.body.price,
        userId = data.user.Id;

    return new Promise(async (resolve, reject) => {

        try {
            let orderId = await counterHlp.counters("order", "1")

            let date = new Date(),
                prodDetails = {};

            prodDetails.ordId = orderId
            prodDetails.prodId = prodId
            prodDetails.prodName = prodName
            prodDetails.quantity = quantity
            prodDetails.rentedPrice = price
            prodDetails.rentedDate = date
            prodDetails.rating = undefined
            prodDetails.ratingFlag = false

            //Start mongodb transaction session 
            const session = await mongoose.startSession();
            session.startTransaction();

            try {

                await Promise.all([
                    updateCurrRentedProd(userId, prodDetails),
                    updateRentedProdDetail(prodId, quantity)
                ]);

                //Commit the transaction when all the database operations performed successfully.
                await session.commitTransaction();
                session.endSession();

                logger.info(loggerName + " Successfully rented product " + + " @@@")
                resolve("Successfully rented product")

            } catch (err) {

                logger.error(loggerName + " Error in renting product " + err)
                //Rollback database state changes.
                await session.abortTransaction();
                session.endSession();


                reject(" Error in renting a product. Please try again!!!")
            }
        } catch (err) {

            logger.error(loggerName + err);
            let orderId = await counterHlp.counters("-1")

            reject("Error in renting a product. Please try again!!!");
        }
    });
}


/**
 * update product's rating detail
 * @param {String} prodId
 * @param {Object} rateDetails
 * 
 * @returns {Promise}
 */

function updateProdRatingDetail(prodId, rateDetails) {

    return new Promise(async (resolve, reject) => {

        productsSchema.findOneAndUpdate(
            {
                "prodId": prodId
            },
            {
                upsert: false,
                new: true
            }).exec(function (err, doc) {
                if (err) {
                    logger.info(loggerName + " Error in udating product's rating Details. " + err)
                    reject(" Error in rating a product. Please try again!!! " + err)
                } else {

                    doc.avgRating = (doc.avgRating * doc.ratings.length + rateDetails.rating * 1) / (doc.ratings.length + 1)
                    doc.ratings.push(rateDetails)

                    doc.save();
                    logger.info(loggerName + " Product's rating details updated successfully @@@")
                    resolve("Product's rating details updated successfully @@@")

                }
            })
    });

}


/**
 * rate the product 
 * @param {String} prodId
 * 
 * @returns {Promise}
 */

exports.rateProduct = function (data) {

    let ordId = data.body.ordId,
        prodId = data.body.prodId,
        rating = data.body.rating,
        comment = data.body.comment,
        userId = data.user.Id,
        userName = data.user.name;

    return new Promise(async (resolve, reject) => {

        let date = new Date(),
            rateDetails = {};

        rateDetails.custName = userName
        rateDetails.rating = rating
        rateDetails.commentdDate = date
        rateDetails.comment = comment

        //Start mongodb transaction session 
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await Promise.all([
                updateProdRatingDetail(prodId, rateDetails),
                updateUserRatingDetail(userId, ordId, prodId, rating)
            ]);

            //Commit the transaction when all the database operations performed successfully.
            await session.commitTransaction();
            session.endSession();

            logger.info(loggerName + " Product rated successfully @@@")
            resolve("Product rated successfully")

        } catch (err) {

            logger.error(loggerName + " Error in rating the product " + err)
            //Rollback database state changes.
            await session.abortTransaction();
            session.endSession();


            reject(" Error in rating the product. Please try again!!!")
        }
    });
}


/**
 * getting average rating of a product
 * @param {String} prodId
 * 
 * @returns {Promise}
 */

exports.getProdAvgRating = function (data) {

    return new Promise(async (resolve, reject) => {

        let prodId = data.params.prodId;

        productsSchema.findOne({
            prodId: prodId
        },{
            '_id': 0,
            'avgRating': 1
        })
            .exec()
            .then(async (avgRating) => {
                if (avgRating) {
                    logger.info(loggerName + " Avg rating of product fetched successfully @@@")
                    resolve(avgRating)
                } else {
                    logger.info(loggerName + " Product not found !!!")
                    reject("Product not found !!!")
                }
            })
    });

}


/**
 * getting all ratings of a product
 * @param {String} prodId
 * 
 * @returns {Promise}
 */

exports.getAllRatings = function (data) {

    return new Promise(async (resolve, reject) => {

        let prodId = data.params.prodId;

        productsSchema.findOne({
            prodId: prodId
        },{
            '_id': 0,
            'ratings': 1
        })
            .exec()
            .then(async (avgRating) => {
                if (avgRating) {
                    logger.info(loggerName + " All ratings of product fetched successfully @@@")
                    resolve(avgRating)
                } else {
                    logger.info(loggerName + " Product not found !!!")
                    reject("Product not found !!!")
                }
            })
    });

}