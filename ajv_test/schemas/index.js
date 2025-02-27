
const Ajv = require('ajv'); 
const ajv = new Ajv({ allErrors: true });


const schemaUser = require('./user.schema.json');
const schemaProduct = require('./product.schema.json');

//registramos cada esquema con una clave/nombre
ajv.addSchema(schemaUser, 'usuario');
ajv.addSchema(schemaProduct, 'producto');


module.exports = ajv;
