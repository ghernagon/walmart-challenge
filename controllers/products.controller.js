const { response } = require('express');
const Product = require('../models/products.model');

const maxAllowed = 5;
const individualDisccount = 10;
const minTermLength = 3;

const getProducts = async(req, res = response) => {
    const term = req.body.term;
    const regex = new RegExp( term, 'i' );
    const isID = !isNaN(term);

    let results;
    let products = [];

    try {
        if ((term && term.length >= minTermLength && !isID) || !term) {
            console.log('es texto');
            results = await Product.find({ "$or": [{ brand: regex }, { description: regex }] }).lean();
            products = results.map(prod => ({
                ...prod,
                disccount: term ? calculateDisccount(prod.description) : null
            }));
        } else if (isID) {
            console.log('es numero');
            results = await Product.findOne({ id: term });
            if (results) products.push(results);
        }
    } catch (error) {
        console.log(error);
        products = null;
    }

    if (products && products.length) {
        res.render('./partials/result', { term, products });
    } else {
        res.render('./partials/no-results', { term });
    }
}

function calculateDisccount(input) {
    let result = findDuplicateCharacters(input);
    return result.length > maxAllowed ? maxAllowed * individualDisccount : result.length * individualDisccount;
}

function findDuplicateCharacters(input) {
    let charCount = input.toLowerCase().replace(/\s/g, '').split('').reduce((acc, val) => {
        acc[val] = ++acc[val] || 1;
        return acc;
    }, {});

    let duplicatedChars = Object.keys(charCount).filter((key) => charCount[key] > 1);

    return duplicatedChars;
}


module.exports = { getProducts };