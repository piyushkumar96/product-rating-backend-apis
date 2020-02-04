/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/product-rating-backend-apis
* 
*   This file is used for setting up the environment variables for testing users routes
 **************************************************************************/

'use strict';

//External Modules 
const   mongoose = require('mongoose'),
        jwt = require('jsonwebtoken'),
        uuidv4 = require('uuid/v4');

// Internal Modules
const   user = require('../../../models/users/usersModel'),
        product = require('../../../models/products/productsModel'),
        config = require('../../../../config/config.json');
        
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    Id: uuidv4(),
    name: 'Piyu Kumar',
    email: 'piyu@gmail.com',
    password: 'Welcome@123',
    age: 23,
    userType:'admin',
    tokens: [{
        token: jwt.sign({ _id: userOneId}, config.jwt_secret)
    }]
}


const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    Id: uuidv4(),
    name: 'Ayush Kumar',
    email: 'ayush@gmail.com',
    password: 'Welcome@123',
    age: 28,
    userType:'customer',
    tokens: [{
        token: jwt.sign({ _id: userTwoId}, config.jwt_secret)
    }]
}

const prodOneId = new mongoose.Types.ObjectId()
const prodOne = {
    _id: prodOneId,
    prodId: 'PROD1',
    prodName: 'Tables',
    actualPrice: 100,
    discntPrice: 100,
    color: 'black',
    status: 'available',
    quantity: 100
}

const setupDatabase = async () => {
    await user.deleteMany()
    await product.deleteMany()
    await new user(userOne).save()
    await new user(userTwo).save()
    await new product(prodOne).save()
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    prodOne,
    prodOneId,
    setupDatabase
}
