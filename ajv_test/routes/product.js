// routes/product.js
const express = require('express');
const router = express.Router();

const { validateProduct } = require('../index');

router.post('/', (req, res) => {
  const data = req.body;
  const valid = validateProduct(data);
  if (valid) {
    res.status(200).json({
      message: 'JSON de producto válido',
      data
    });
  } else {
    res.status(400).json({
      message: 'JSON de producto inválido',
      errors: validateProduct.errors
    });
  }
});

module.exports = router;
