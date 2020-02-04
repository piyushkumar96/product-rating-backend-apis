/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/product-rating-backend-apis
* 
*   This file contains products addition, updation etc.
 **************************************************************************/

'use strict';

// Internal Modules
const productsSvc = require('../../services/products/productsSvc'),
    logger = require('../../../logger');

const loggerName = "[productsCntrl]: ";

// function for adding a new product
exports.addProduct = async function (req, res) {
    let prodName = req.body.prodName,
        actualPrice = req.body.actualPrice,
        color = req.body.color,
        status = req.body.status,
        quantity = req.body.quantity,
        userType = req.user.userType;

        logger.info(req.body)

    if (userType != "admin") {
        logger.error(loggerName + userType + ", User of this type is not authorised to add product!!!")
        res.status(400).json({
            success: false,
            message: 'User not authorised to add product'
        });

    } else if (!prodName || !actualPrice || !color || !status || !quantity) {
        logger.error(loggerName + "Invalid Parameters while addinng products !!!")
        res.status(400).json({
            success: false,
            message: 'Invalid parameters'
        });
    } else {

        try {
            let result = await productsSvc.addProduct(req);
            res.status(201).json({
                success: true,
                message: result
            });
        } catch (err) {
            logger.error(loggerName + err)
            res.status(400).json({
                success: false,
                message: err
            });
        }
    }
}


// function for getting product by Id 
exports.getProduct = async function (req, res) {

    try {

        let result = await productsSvc.getProduct(req);
        res.status(200).json({
            success: true,
            message: result
        });
    } catch (err) {
        logger.error(loggerName + err)
        res.status(400).json({
            success: false,
            message: err
        });
    }
}


// function for getting all products
exports.getAllProducts = async function (req, res) {

    try {

        let result = await productsSvc.getAllProducts(req);
        res.status(200).json({
            success: true,
            message: result
        });
    } catch (err) {
        logger.error(loggerName + err)
        res.status(400).json({
            success: false,
            message: err
        });
    }
}


// function for getting all products available
exports.getAllProductsAvail = async function (req, res) {

    try {

        let result = await productsSvc.getAllProductsAvail(req);
        res.status(200).json({
            success: true,
            message: result
        });
    } catch (err) {
        logger.error(loggerName + err)
        res.status(400).json({
            success: false,
            message: err
        });
    }
}


// function for update the product's discounted price
exports.updateDiscntPrice = async function (req, res) {

    let prodId = req.body.prodId,
        discntPrice = req.body.discntPrice,
        userType = req.user.userType;

    if (userType != "admin") {
        logger.error(loggerName + userType + ", User of this type is not authorised to update discount price of the product!!!")
        res.status(400).json({
            success: false,
            message: 'User not authorised to update product'
        });

    } else if (!prodId || !discntPrice) {
        logger.error(loggerName + "Invalid Parameters while updating discounted price of product !!!")
        res.status(400).json({
            success: false,
            message: 'Invalid parameters'
        });
    } else {
        try {

            let result = await productsSvc.updateDiscntPrice(req);
            res.status(200).json({
                success: true,
                message: result
            });
        } catch (err) {
            logger.error(loggerName + err)
            res.status(400).json({
                success: false,
                message: err
            });
        }
    }
}


// function for update the product's quantity 
exports.updateProdQty = async function (req, res) {

    let prodId = req.body.prodId,
        quantity = req.body.quantity,
        userType = req.user.userType;

    if (userType != "admin") {
        logger.error(loggerName + userType + ", User of this type is not authorised to update quantity of the product!!!")
        res.status(400).json({
            success: false,
            message: 'User not authorised to update product'
        });

    } else if (!prodId || !quantity) {
        logger.error(loggerName + "Invalid Parameters while updating qunatity of product !!!")
        res.status(400).json({
            success: false,
            message: 'Invalid parameters'
        });
    } else {
        try {

            let result = await productsSvc.updateProdQty(req);
            res.status(200).json({
                success: true,
                message: result
            });
        } catch (err) {
            logger.error(loggerName + err)
            res.status(400).json({
                success: false,
                message: err
            });
        }
    }
}

// function for update the product's status
exports.updateProdStatus = async function (req, res) {
    let prodId = req.body.prodId,
        status = req.body.status,
        userType = req.user.userType;

    if (userType != "admin") {
        logger.error(loggerName + userType + ", User of this type is not authorised to update product!!!")
        res.status(400).json({
            success: false,
            message: 'User not authorised to update product'
        });

    } else if (!prodId || !status) {
        logger.error(loggerName + "Invalid Parameters while updating status of product !!!")
        res.status(400).json({
            success: false,
            message: 'Invalid parameters'
        });
    } else {
        try {

            let result = await productsSvc.updateProdStatus(req);
            res.status(200).json({
                success: true,
                message: result
            });
        } catch (err) {
            logger.error(loggerName + err)
            res.status(400).json({
                success: false,
                message: err
            });
        }
    }
}

// function for renting a product
exports.rentProduct = async function (req, res) {
    let prodId = req.body.prodId,
        prodName = req.body.prodName,
        quantity = req.body.quantity,
        price = req.body.price,
        userType = req.user.userType;

    if (userType != "customer") {
        logger.error(loggerName + userType + ", User of this type is not authorised to rent a product!!!")
        res.status(400).json({
            success: false,
            message: 'User not authorised to rent a product'
        });

    } else if (!prodId || !prodName || !quantity || !price) {
        logger.error(loggerName + "Invalid Parameters while renting a product !!!")
        res.status(400).json({
            success: false,
            message: 'Invalid parameters'
        });
    } else {
        try {

            let result = await productsSvc.rentProduct(req);
            res.status(200).json({
                success: true,
                message: result
            });
        } catch (err) {
            logger.error(loggerName + err)
            res.status(400).json({
                success: false,
                message: err
            });
        }
    }
}


// function for rating a product
exports.rateProduct = async function (req, res) {
    let prodId = req.body.prodId,
        rating = req.body.rating,
        comment = req.body.comment,
        userType = req.user.userType;

    if (userType != "customer") {
        logger.error(loggerName + userType + ", User of this type is not authorised to rent a product!!!")
        res.status(400).json({
            success: false,
            message: 'User not authorised to rent a product'
        });

    } else if (!prodId || !rating || !comment) {
        logger.error(loggerName + "Invalid Parameters while renting a product !!!")
        res.status(400).json({
            success: false,
            message: 'Invalid parameters'
        });
    } else {
        try {

            let result = await productsSvc.rateProduct(req);
            res.status(200).json({
                success: true,
                message: result
            });
        } catch (err) {
            logger.error(loggerName + err)
            res.status(400).json({
                success: false,
                message: err
            });
        }
    }
}


// function for getting average rating of a product
exports.getProdAvgRating = async function (req, res) {

    try {

        let result = await productsSvc.getProdAvgRating(req);
        res.status(200).json({
            success: true,
            message: result
        });
    } catch (err) {
        logger.error(loggerName + err)
        res.status(400).json({
            success: false,
            message: err
        });
    }
}


// function for getting all ratings of a product
exports.getAllRatings = async function (req, res) {

    try {

        let result = await productsSvc.getAllRatings(req);
        res.status(200).json({
            success: true,
            message: result
        });
    } catch (err) {
        logger.error(loggerName + err)
        res.status(400).json({
            success: false,
            message: err
        });
    }
}