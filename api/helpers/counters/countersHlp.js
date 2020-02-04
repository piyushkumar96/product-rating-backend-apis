/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/product-rating-backend-apis
* 
*   This file contains autoincrement counter for products
 **************************************************************************/
'use strict';

// Internal Modules
const counterSchema = require('../../models/counters/countersModel'),
    logger = require('./../../../logger');

const loggerName = "[counterHelper ]: ";

exports.counters = (role, count) => {

    return new Promise((resolve, reject) => {
        try {

            if (role == "product") {
                counterSchema.findByIdAndUpdate({ _id: 'prodId' },
                    { $inc: { seq: parseInt(count) } },
                    {
                        new: true,
                        upsert: true // Make this update into an upsert
                    },
                    function (error, counter) {
                        if (error)
                            throw Error("Something happened wrong. Please try again");
                        resolve ("PROD" + counter.seq);
                    });
            } else if (role == "order") {
                console.log(counterSchema)
                counterSchema.findByIdAndUpdate({ _id: 'orderId' },
                    { $inc: { "seq": parseInt(count)  } },
                    {
                        new: true,
                        upsert: true // Make this update into an upsert
                    },
                    function (error, counter) {
                        if (error)
                            throw Error("Something happened wrong. Please try again");
                        resolve ("ORD" + counter.seq);
                    });
            } else{
                reject("Invalid Role type.")
            }

        } catch (err) {
            logger.error(loggerName + err)
            reject("Something happened wrong. Please try again")
        }
    })
}