
# Operadores Lógicos en MongoDB

## Descripción

Los operadores lógicos permiten construir consultas más complejas combinando múltiples condiciones.

## Operadores

- `$and`: Todas las condiciones deben cumplirse
- `$or`: Al menos una condición debe cumplirse
- `$nor`: Ninguna condición debe cumplirse
- `$not`: Nega la condición dada

## Consultas

```js
//Buscar alojamientos que: Acepten más de 4 personas y  tengan al menos 2 baños
db.listingsAndReviews.find({ "$and": [{"accommodates":{ "$gt": 4}}, {"bedrooms": {"$gte": 2} }]})

// Equivalente con AND implícito
db.listingsAndReviews.find({"accommodates":{ "$gt": 4}, "bedrooms": {"$gte": 2} })

// OR para "Apartment" o "House"
db.listingsAndReviews.find({ "$or": [{"property_type": "Apartment"}, {"property_type": "House" }]})

// NO Wifi en amenities
db.listingsAndReviews.find({ "$nor": [{"amenities": "Wifi"}]})

// No "Apartment" ni "House"
db.listingsAndReviews.find({ "$nor": [{"property_type": "Apartment"}, {"property_type": "House" }]})

// Más de 2 habitaciones y máximo 6 personas
db.listingsAndReviews.find({ "$and": [{"bedrooms": {"$gt": 2}}, {"accommodates": {"$lte": 6} }]})

// Combinación de $and y $or
db.routes.find({ "$and": [
  { "$or": [ { "dst_airport": "KZN" }, { "src_airport": "KZN" }] },
  { "$or": [ { "airplane": "CR2" }, { "airplane": "A81" }] }
]})
