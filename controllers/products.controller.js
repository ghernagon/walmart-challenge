const { response } = require('express');
const Product = require('../models/products.model');

const getProducts = async(req, res = response) => {
    
    const term = req.params.term;
    const regex = new RegExp( term, 'i' );

    const products = await Product.find({ "$or": [ { brand: regex }, { description: regex }] });

    res.render('result', { term, products: products.length ? products : null });
}

module.exports = { getProducts };