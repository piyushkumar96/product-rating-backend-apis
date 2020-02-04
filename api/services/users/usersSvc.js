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
const bcrypt = require('bcryptjs'),
    uuidv4 = require('uuid/v4');

// Internal Modules
const userSchema = require('../../models/users/usersModel'),
    config = require('../../../config/config.json'),
    logger = require('../../../logger'),
    counterHlp = require('../../helpers/counters/countersHlp');
// emailHlp = require('../../helpers/email/emailHlp');

const loggerName = "[usersSvc ]: ";

/**
 * Create User
 * @param {String} name
 * @param {String} email
 * @param {String} password
 * @param {String} portfolios
 *
 * @returns {Promise}
 */

exports.createUser = function (data) {
    return new Promise(async (resolve, reject) => {

        data.Id = uuidv4()
        const user = new userSchema(data)
        try {
            await user.save()
            //emailHlp.sendWelcomeMail(user.name, user.email)
            const token = await user.generateAuthToken()
            logger.info(loggerName + "User Created Successfully @@@")
            resolve({ "user": user, "token": token })

        } catch (err) {
            logger.error(loggerName + err);
            if (err.name === 'MongoError' && err.code === 11000) {
                reject("User with email address exists");
            }
            reject(err.message);
        }

    });
}


/**
 * Login User
 * @param {String} email
 * @param {String} password
 *
 * @returns {Promise}
 */

exports.loginUser = function (loginData) {

    return new Promise(async (resolve, reject) => {

        try {
            const user = await userSchema.findByCrendentials(loginData.email, loginData.password)
            const token = await user.generateAuthToken()
            logger.info(loggerName + "User " + user.name + " login Successfully @@@")
            resolve({ "user": user, "token": token })

        } catch (err) {
            logger.error(loggerName + err);
            reject("Authentication failed");
        }
    });

}


/**
 * Get User
 *
 * @returns {Promise}

exports.getUser = function() {

    return new Promise(async (resolve, reject) => {

        try {
            const user = await userSchema.findByCrendentials(loginData.email, loginData.password)
            const token = await user.generateAuthToken()
            resolve({"user": user,"token":token})

        } catch (err) {
            logger.error(loggerName+err);
            reject("Authentication failed");
        }
    });

}
*/


/**
 * Logout User's Current Session
 *
 * @returns {Promise}
 */

exports.logoutCS = function (data) {

    return new Promise(async (resolve, reject) => {

        try {
            data.user.tokens = data.user.tokens.filter((token) => {
                return token.token !== data.token
            })
            await data.user.save()
            logger.info(loggerName + "User " + data.user.name + " LogOut Current Session Successfully @@@")
            resolve("LogOut Current Session Successfully")

        } catch (err) {
            logger.error(loggerName + err);
            reject("Something failed, Please retry");
        }
    });

}

/**
 * Logout User's All Sessions
 *
 * @returns {Promise}
 */

exports.logoutAS = function (data) {

    return new Promise(async (resolve, reject) => {

        try {
            data.user.tokens = []
            await data.user.save()
            logger.info(loggerName + "User " + data.user.name + " LogOut All Sessions Successfully @@@")
            resolve("LogOut All Sessions Successfully")

        } catch (err) {
            logger.error(loggerName + err);
            reject("Something failed, Please retry");
        }
    });

}

/**
 * Update user's profile
 *
 * @returns {Promise}
 */

exports.updateUser = function (data) {

    return new Promise(async (resolve, reject) => {

        const updates = Object.keys(data.body)
        const allowedUpdates = ["age"]
        const isvalidOperation = updates.every((updates) => allowedUpdates.includes(updates))

        if (!isvalidOperation) {
            reject("Invalid updates!!!")
        }

        try {
            updates.forEach((update) => data.user[update] = data.body[update])
            await data.user.save()
            logger.info(loggerName + "User " + data.user.name + " User Successfully Updated @@@")
            resolve("User Successfully Updated")

        } catch (err) {
            logger.error(loggerName + err);
            reject("Something failed, Please retry");
        }
    });

}


/**
 * Update user's profile
 * @param {String} oldPassword
 * @param {String} newPassword
 *
 * @returns {Promise}
 */

exports.updatePassword = function (data) {

    return new Promise(async (resolve, reject) => {

        try {

            const isvalidOperation = bcrypt.compareSync(data.body.oldPassword, data.user.password)
            if (!isvalidOperation) {
                logger.info(loggerName + "User " + data.user.name + " Incorrect Old password !!!")
                reject("Incorrect Old password!!!")
            }

            data.user.password = data.body.newPassword
            await data.user.save()
            logger.info(loggerName + "User " + data.user.name + " Password Successfully Updated @@@")
            resolve("Password Successfully Updated")

        } catch (err) {
            logger.error(loggerName + err);
            reject(err.message);
        }
    });

}

/**
 * delete user profile
 *
 * @returns {Promise}
 */

exports.deleteUser = function (data) {

    return new Promise(async (resolve, reject) => {
        try {

            await data.user.remove()
            //emailHlp.sendGoodbyeMail(data.user.name, data.user.email)
            logger.info(loggerName + "User " + data.user.name + " User Successfully deleted @@@")
            resolve("User Successfully Deleted")

        } catch (err) {
            logger.error(loggerName + err);
            reject("Something failed, Please retry");
        }
    });

}


/**
 * update user's profile after rent a product 
 * @param {String} userId
 * @param {Object} prodDetails
 * 
 * @returns {Promise}
 */

exports.updateCurrRentedProd = function (userId, prodDetails) {

    return new Promise((resolve, reject) => {
        userSchema.findOneAndUpdate(
            {
                "Id": userId
            },
            {
                $push: { rentedProducts: prodDetails }
            },
            {
                upsert: false,
                new: true
            },
            function (err, doc) {
                if (err) {
                    logger.info(loggerName + " Error in renting a product. User's profile udpate failed")
                    reject(" Error in rentinng a product. Please try again!!!")
                } else {
                    logger.info(loggerName + " Successfully updated user's profile after renting  @@@")
                    resolve("Successfully updated user's profile after renting")
                }
            });
    });

}

/**
 * update product's rating in user profile
 * @param {String} userId
 * @param {String} ordId
 * @param {String} prodId
 * @param {String} rating
 * 
 * @returns {Promise}
 */

exports.updateUserRatingDetail = function (userId, ordId, prodId, rating) {

    return new Promise((resolve, reject) => {
        userSchema.findOneAndUpdate(
            {
                "Id": userId,
                "rentedProducts.ordId": ordId,
                "rentedProducts.prodId": prodId,
                "rentedProducts.ratingFlag": false
            },
            {
                $set: {
                    'rentedProducts.$.rating': rating,
                    'rentedProducts.$.ratingFlag': true,
                }
            },
            {
                upsert: false,
                new: true
            },
            function (err, doc) {
                if (err) {
                    logger.info(loggerName + " Error in renting a product. User's profile udpate failed " + err)
                    reject(" Error in rentinng a product. Please try again!!! " + err)
                } else {
                    logger.info(loggerName + " Successfully updated user's profile after renting  @@@")
                    resolve("Successfully updated user's profile after renting")
                }
            });
    });

}


/**
 * return a product
 * @param {String} userId
 * @param {String} ordId
 * @param {String} prodId
 * 
 * @returns {Promise}
 */

exports.returnProduct = function (data) {

    let userId = data.user.Id,
        ordId = data.body.ordId,
        prodId = data.body.prodId,
        date = new Date();

    return new Promise((resolve, reject) => {
        userSchema.findOneAndUpdate(
            {
                "Id": userId
            },
            {
                $set: {
                    "rentedProducts.$[elem].returnDate": date,
                    "rentedProducts.$[elem].rentedFlag": false
                }
            },
            {
                arrayFilters: [{ "elem.ordId": ordId, "elem.prodId": prodId }],
                upsert: false,
                new: true
            },
            function (err, doc) {
                if (err) {
                    logger.info(loggerName + " Error in returning a product. User's profile udpate failed " + err)
                    reject(" Error in returning a product. Please try again!!!")
                } else {
                    logger.info(loggerName + " Product returned successfully @@@")
                    resolve("Product returned successfully")
                }
            });
    });

}

/**
 * get all currently rented products 
 * @param {String} userId
 * 
 * @returns {Promise}
 */

exports.getCurrRentedProduct = function (data) {

    return new Promise(async (resolve, reject) => {

        let userId = data.user.Id;

        userSchema.aggregate([
            {
                $unwind: "$rentedProducts"
            },
            {
                $match: {
                    "rentedProducts.rentedFlag": true,
                    "Id": userId
                }
            },
            {
                $group: {
                    _id: '$_id',
                    rentedProducts: { $push: '$rentedProducts' }
                }
            },
            {
                $project: {
                    _id: 0,
                    rentedProducts: 1
                }
            }


        ])
            .exec()
            .then(async (user) => {
                if (user) {
                    logger.info(loggerName + " Current rented products fetched successfully @@@")
                    resolve(user)
                } else {
                    logger.info(loggerName + " No product rented@@")
                    reject("No product rented")
                }
            })
    });

}


/**
 * get all previously rented products 
 * @param {String} userId
 * 
 * @returns {Promise}
 */

exports.getPrevRentedProduct = function (data) {

    return new Promise(async (resolve, reject) => {

        let userId = data.user.Id;

        userSchema.aggregate([
            {
                $unwind: "$rentedProducts"
            },
            {
                $match: {
                    "rentedProducts.rentedFlag": false,
                    "Id": userId
                }
            },
            {
                $group: {
                    _id: '$_id',
                    rentedProducts: { $push: '$rentedProducts' }
                }
            },
            {
                $project: {
                    _id: 0,
                    rentedProducts: 1
                }
            }


        ])
            .exec()
            .then(async (user) => {
                if (user) {
                    logger.info(loggerName + " Previously rented products fetched successfully @@@")
                    resolve(user)
                } else {
                    logger.info(loggerName + " No product rented history@@")
                    reject("No product rented history")
                }
            })
    });

}


