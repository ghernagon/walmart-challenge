const { response } = require('express');
const Product = require('../models/products.model');

const maxAllowed = 5;
const individualDisccount = 10;
const minTermLength = 3;

const getProducts = async(req, res = response) => {
    const term = req.body.term;
    const regex = new RegExp( term, 'i' );
    const isID = term && !isNaN(term);

    let products = [];

    try {
        let results = await findProducts(isID, term, regex);
        products = mapResults(results);
    } catch (error) {
        console.log('HA OCURRIDO UN ERROR', error);
        products = null;
    }
    if (products && products.length) {
        res.render('./partials/result', { term, products }, (err, html) => res.send({ render: html, data: products }));
    } else {
        res.render('./partials/no-results', { term }, (err, html) => res.send({ render: html, data: null }));
    }
}

/**
 * Perform databse search
 * @param {*} isID 
 * @param {*} term 
 */
async function findProducts(isID, term, regex) {
    let results = [];
    if (isID) {
        let result = await Product.findOne({ id: term }).lean();
        if (result) {
            results.push(result);
        } else {
            results = await Product.find({ "$or": [{ brand: regex }, { description: regex }] }).lean();
        }
    } else if ((term && term.length >= minTermLength && !isID) || !term) {
        results = await Product.find({ "$or": [{ brand: regex }, { description: regex }] }).lean();
    } 
    return results;
}

/**
 * Map results before send back
 * @param {*} result 
 */
function mapResults(result) {
    return result.map(prod => {
        let disccount = calculateDisccount(prod.description);
        delete prod._id;
        return {
            ...prod,
            disccount: disccount,
            fullPrice: formatCurrency(prod.price),
            offerPrice: disccount ? calculateProductWithDisccount(prod.price, disccount) : null
        }
    });
}

/**
 * Format price to CLP Currency
 * @param {*} input 
 */
function formatCurrency(input) {
    if (isNaN(input)) {
        throw new Error('price must be a number');
    }
    return '$ ' + input.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

/**
 * Calculate product price after disccount
 * @param {*} price product price
 * @param {*} disccount product disccount to be applied
 */
function calculateProductWithDisccount(price, disccount) {
    if (isNaN(price)) {
        throw new Error('price must be a number');
    } else if (isNaN(disccount)) {
        throw new Error('disccount must be a number');
    }

    const offer = price - (price * ( disccount / 100 ));
    return formatCurrency(offer);
}

/**
 * Calculate disccount % to be applied
 * @param {*} input string to calculate disccount
 */
function calculateDisccount(input) {
    let result = findDuplicateCharacters(input);
    return result.length > maxAllowed ? maxAllowed * individualDisccount : result.length * individualDisccount;
}

/**
 * Find duplicate characters in string
 * @param {*} input string
 */
function findDuplicateCharacters(input) {
    if (!(typeof input === 'string' || input instanceof String)) {
        throw new Error('description must be a string');
    }
    
    let charCount = input.toLowerCase().replace(/\s/g, '').split('').reduce((acc, val) => {
        acc[val] = ++acc[val] || 1;
        return acc;
    }, {});

    let duplicatedChars = Object.keys(charCount).filter((key) => charCount[key] > 1);

    return duplicatedChars;
}




module.exports = { 
    getProducts,
    findDuplicateCharacters,
    calculateDisccount,
    formatCurrency,
    calculateProductWithDisccount,
    findProducts
};