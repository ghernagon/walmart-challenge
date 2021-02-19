var express = require('express');
var router = express.Router();
const { getProducts } = require('../controllers/products.controller');

/* GET products listing. */
router.get('/', (req, res) => { res.render('search') });
router.post('/', getProducts);

module.exports = router;
