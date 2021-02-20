const { response } = require('express');
const Product = require('../models/products.model');

const maxAllowed = 5;
const individualDisccount = 10;
const minTermLength = 3;

const getProducts = async(req, res = response) => {
    const term = req.body.term;
    const regex = new RegExp( term, 'i' );
    const isID = !isNaN(term);

    let products = [];

    try {
        if ((term && term.length >= minTermLength && !isID) || !term) {
            let results = await Product.find({ "$or": [{ brand: regex }, { description: regex }] }).lean();
            products = results.map(prod => {
                let disccount = term ? calculateDisccount(prod.description) : null;
                return {
                    ...prod,
                    disccount: disccount,
                    fullPrice: formatCurrency(prod.price),
                    offerPrice: disccount ? calculateProductWithDisccount(prod.price, disccount) : null
                }
            });
        } else if (isID) {
            let result = await Product.findOne({ id: term }).lean();
            if (result) {
                let prod = { ...result };
                prod.fullPrice = formatCurrency(result.price);
                products.push(prod);
            }
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

/**
 * Format price to CLP Currency
 * @param {*} input 
 */
function formatCurrency(input) {
    return '$ ' + input.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

/**
 * Calculate product price after disccount
 * @param {*} price product price
 * @param {*} disccount product disccount to be applied
 */
function calculateProductWithDisccount(price, disccount) {
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
    calculateProductWithDisccount
};