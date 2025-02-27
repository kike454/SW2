// routes/user.js
const express = require('express');
const router = express.Router();

const { validateUser } = require('../index');

router.post('/', (req, res) => {
  const data = req.body;
  const valid = validateUser(data);
  
  if (valid) {
    res.status(200).json({
      message: 'JSON de usuario válido',
      data
    });
  } else {
    res.status(400).json({
      message: 'JSON de usuario inválido',
      errors: validateUser.errors
    });
  }
});

module.exports = router;
