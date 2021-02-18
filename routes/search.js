var express = require('express');
var router = express.Router();
const { getProducts } = require('../controllers/products.controller');

/* GET products listing. */
router.get('/:term', getProducts);

module.exports = router;
