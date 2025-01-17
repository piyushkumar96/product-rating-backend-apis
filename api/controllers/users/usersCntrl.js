/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/product-rating-backend-apis
* 
*   This file contains users creation, login, updation control flow
 **************************************************************************/

'use strict';

// Internal Modules
const usersSvc = require('../../services/users/usersSvc'),
    logger = require('../../../logger');

const loggerName = "[usersCntrl]: ";

// function for creating a new user
exports.createUser = async function (req, res) {
    let name = req.body.name,
        email = req.body.email,
        password = req.body.password,
        userType = req.body.userType;

    if (!name || !email || !password || !userType) {
        logger.error(loggerName + "Invalid Parameters while creating User !!!")
        res.status(400).json({
            success: false,
            message: 'Invalid parameters'
        });
    } else {

        try {
            let result = await usersSvc.createUser(req.body);
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

// function for logging user
exports.loginUser = async function (req, res) {
    let email = req.body.email,
        password = req.body.password;

    if (!email || !password) {
        logger.error(loggerName + "Invalid Parameters while logging User !!!")
        res.status(400).json({
            success: false,
            message: 'Invalid parameters'
        });
    } else {

        try {
            let result = await usersSvc.loginUser(req.body);
            logger.info("User logined Succefully @@@")
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

// function for getting user
exports.getUser = async function (req, res) {

    try {
        let result = req.user;
        logger.info("Get the User @@@")
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


// function for logout user's current session
exports.logoutCS = async function (req, res) {
    try {
        let result = await usersSvc.logoutCS(req);
        res.status(200).json({
            success: true,
            message: result
        });
    } catch (err) {
        logger.error(loggerName + err)
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

// function for logout user's all session
exports.logoutAS = async function (req, res) {
    try {
        let result = await usersSvc.logoutAS(req);
        res.status(200).json({
            success: true,
            message: result
        });
    } catch (err) {
        logger.error(loggerName + err)
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

// function for update the user's profile
exports.updateUser = async function (req, res) {
    try {
        let result = await usersSvc.updateUser(req);
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

// function for update the user's password
exports.updatePassword = async function (req, res) {

    let password = req.body.oldPassword,
        newPassword = req.body.newPassword,
        cfmPassword = req.body.cfmPassword;

    if (!password || !newPassword || !cfmPassword) {
        res.status(400).json({
            success: false,
            message: 'Missing parameters!!!'
        });
    } else if (newPassword !== cfmPassword) {
        res.status(400).json({
            success: false,
            message: 'Password did not Match!!!'
        });
    } else {

        try {
            let result = await usersSvc.updatePassword(req);
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


// function for deleting the user
exports.deleteUser = async function (req, res) {
    try {
        let result = await usersSvc.deleteUser(req);
        res.status(200).json({
            success: true,
            message: result
        });
    } catch (err) {
        logger.error(loggerName + err)
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

// function for getting all currently rented products
exports.getCurrRentedProduct = async function (req, res) {

    try {
        let result = await usersSvc.getCurrRentedProduct(req);
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


// function for getting all previously rented products
exports.getPrevRentedProduct = async function (req, res) {

    try {
        let result = await usersSvc.getPrevRentedProduct(req);
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


// function for returning a product
exports.returnProduct = async function (req, res) {
    let prodId = req.body.prodId,
        ordId = req.body.ordId,
        userType = req.user.userType;

    if (userType != "customer") {
        logger.error(loggerName + userType + ", User of this type is not authorised to return a product!!!")
        res.status(400).json({
            success: false,
            message: 'User not authorised to return a product'
        });

    } else if (!prodId || !ordId) {
        logger.error(loggerName + "Invalid Parameters for returning a product !!!")
        res.status(400).json({
            success: false,
            message: 'Invalid parameters'
        });
    } else {
        try {

            let result = await usersSvc.returnProduct(req);
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
