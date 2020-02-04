/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/product-rating-backend-apis
* 
*   This file contains product Model require to create product
 **************************************************************************/

'use strict';

//External modules
const   mongoose    = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    prodId: {
        type: String,
        required: true,
    },
    prodName: {
        type: String,
        required: true,
        trim: true
    },
    actualPrice: {
        type: Number,
        required: true,
    },
    discntPrice: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    noOfOrderPlaced: {
        type: Number,
        default: 0,
    },
    totalQtyOrdered: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        required: true,
        validate(value){
            if(value < 0) {
                throw new Error('Quantity must be a postive Number')
            }
        }
    },
    ratings:[{
        custName: { 
            type: String, 
            trim: true, 
            required: true 
        },
        rating: { 
            type: Number, 
            required: true
        },
        commentdDate: { 
            type: Date, 
            required: true
        },
        comment: { 
            type: String
        }
    }],
    avgRating: {
        type: Number,
        default: 0,
    }
})

const products = mongoose.model('products', productSchema);
module.exports = products