//dado que el fichero ubicado dentro de la carpeta shcmeas se llama index, podemos importar los shcemas de esta manera, para que so
const ajv = require('./schemas');

// Ejemplo de objeto a validar con el esquema "persona"
function validateUser(data) {
    // Llama a ajv.validate('usuario', data)
    return ajv.validate('usuario', data);
  }
  
  function validateProduct(data) {
    // Llama a ajv.validate('producto', data)
    return ajv.validate('producto', data);
  }
  
  module.exports = {
    validateUser,
    validateProduct
  };