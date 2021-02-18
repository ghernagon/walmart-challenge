const { response } = require('express');
const Product = require('../models/products.model');

const maxAllowed = 5;
const individualDisccount = 10;

const getProducts = async(req, res = response) => {
    
    const term = req.query.term;
    const regex = new RegExp( term, 'i' );

    // TODO: REVISAR SI ES UN ID PARA BUSCAR SOLO EN EL ID

    // TODO: TERM DEBE SER AL MENOS 3 CARACTERES PARA BUSCAR EN LOS CAMPOS

    const results = await Product.find({ "$or": [ { brand: regex }, { description: regex }] }).lean();

    const products = results.map( prod => ({ 
        ...prod, 
        descuento: calculateDisccount(prod.description)
    }));

    res.render('result', { term, products: products.length ? products : null });
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