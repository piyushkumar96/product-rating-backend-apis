/*************************************************************************
*
*   Author:- piyushkumar96
*   Git:-    https://github.com/piyushkumar96
*   Folder Link:- https://github.com/piyushkumar96/product-rating-backend-apis
* 
*   This file contains all test cases for users
 **************************************************************************/

'use strict';

//External Modules 
const request = require('supertest');

// Internal Modules
const server = require('../../../server'),
    userModel = require('../../models/users/usersModel'),
    productModel = require('../../models/products/productsModel');

const { userOne, userOneId, userTwo, userTwoId, prodOne, prodOneId, setupDatabase } = require('../fixtures/users/users')

beforeEach(setupDatabase)

// test for creating the new User
test('Should create a New User', async () => {
    const response = await request(server)
        .post('/api/v1/createUser')
        .send({
            name: 'Piyush Kumar',
            email: 'piyush25032@gmail.com',
            password: 'Welcome@123',
            age: 23,
            userType: 'admin'

        })
        .expect(201)

    // Assert that the DB was changed successfully
    const user = await userModel.findById(response.body.message.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body.message).toMatchObject({
        user: {
            name: 'Piyush Kumar',
            email: 'piyush25032@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('Welcome@123')
})

// test for login Process
test('Should login existing user', async () => {
    const response = await request(server)
        .post('/api/v1/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)

    const user = await userModel.findById(userOneId)
    expect(response.body.message.token).toBe(user.tokens[1].token)

})

// test for authentication failed
test('Should not login nonexistent user', async () => {
    await request(server)
        .post('/api/v1/login')
        .send({
            email: userOne.email,
            password: 'IncorrectPassword'
        })
        .expect(400)
})

//test for getting the user profile
test('Should get profile for user', async () => {
    await request(server)
        .get('/api/v1/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

// test for authentication failed for getting user profile
test('Should not get profile for unauthenticated user', async () => {
    await request(server)
        .get('/api/v1/user/me')
        .send()
        .expect(401)
})

//test for adding product
test('Should add product', async () => {
    await request(server)
        .post('/api/v1/addProduct')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            prodName: "Tables",
            actualPrice: 100,
            color: "black",
            status: "available",
            quantity: 100
        })
        .expect(201)
})

// test for getting the product
test('Should get the product with id PROD1', async () => {
    await request(server)
        .get(`/api/v1/getProduct/${prodOne.prodId}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
})

// test for getting all the products
test('Should get all the products', async () => {
    await request(server)
        .get('/api/v1/getAllProducts')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
})

// test for updating discounted price of the product
test('Should update discounted price of the product', async () => {
    await request(server)
        .patch('/api/v1/updateDiscntPrice')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            prodId: `${prodOne.prodId}`,
            discntPrice: 90
        })
        .expect(200)

    const product = await productModel.findById(prodOneId)
    expect(product.discntPrice).toEqual(90)
})

// test for renting the product
test('Should rent the product', async () => {
    await request(server)
        .patch('/api/v1/rentProduct')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            prodId: `${prodOne.prodId}`,
            prodName: `${prodOne.prodName}`,
            price: 90,
            quantity: 20
        })
        .expect(200)
})

// test for rating the product
test('Should rate the product', async () => {
    await request(server)
        .patch('/api/v1/rateProduct')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            prodId: `${prodOne.prodId}`,
            ordId: "ORD1",
            rating: 5,
            comment: "stylish and comfortable"
        })
        .expect(200)
})

// test for returning the product
test('Should return the product', async () => {
    await request(server)
        .patch('/api/v1/returnProduct')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            prodId: `${prodOne.prodId}`,
            ordId: "ORD1"
        })
        .expect(200)
})

// test for deleting the user
test('Should delete the user', async () => {
    await request(server)
        .delete('/api/v1/deleteUser')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await userModel.findById(userOneId)
    expect(user).toBeNull()
})

// test for authentication failed for deleting the user
test('Should not delete account for unauthenticate user', async () => {
    await request(server)
        .delete('/api/v1/deleteUser')
        .send()
        .expect(401)
})

// test for updating the valid user fields
test('Should update valid user fields', async () => {
    await request(server)
        .patch('/api/v1/updateUser')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            age: 30
        })
        .expect(200)
    const user = await userModel.findById(userOneId)
    expect(user.age).toEqual(30)
})

