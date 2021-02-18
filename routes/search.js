var express = require('express');
var router = express.Router();
const { getProducts } = require('../controllers/products.controller');

/* GET products listing. */
// router.get('/:term', getProducts);
router.get('/', getProducts);

module.exports = router;
