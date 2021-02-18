const { response } = require('express');
const Product = require('../models/products.model');

const getProducts = async(req, res = response) => {
    
    const products = await Product.find();

    // res.json({
    //     ok: true,
    //     products
    // })

    res.render('index', { title: 'Express', products });
}

module.exports = { getProducts };