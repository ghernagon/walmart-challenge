var express = require('express');
const { getProducts } = require('../controllers/products.controller');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', getProducts);

module.exports = router;
