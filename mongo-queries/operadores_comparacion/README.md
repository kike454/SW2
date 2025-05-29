# Operadores de Comparación en MongoDB

## Descripción

Este documento muestra cómo utilizar los principales operadores de comparación en MongoDB para filtrar documentos basados en condiciones simples de igualdad y desigualdad.

## Operadores

- `$gt`: Mayor que
- `$gte`: Mayor o igual que
- `$lt`: Menor que
- `$lte`: Menor o igual que
- `$eq`: Igual que
- `$ne`: Distinto de

## Consultas

```js
//  Consulta todos los documentos donde el campo "accommodates" sea mayor que 4.
db.listingsAndReviews.find({"accommodates": {"$gt": 6}})

// Devuelve los documentos cuyo campo "bathrooms" sea exactamente igual a 2.
db.listingsAndReviews.find({"bathrooms": {"$eq": 2}})

// Filtra aquellos cuyo "price" (⚠️ cuidado: puede ser string) sea menor que 100.
db.listingsAndReviews.find({"price": {"$lt": 100}})

//Devuelve los documentos donde "bedrooms" sea mayor que 1 **y** "bathrooms" sea mayor o igual a 1.
db.listingsAndReviews.find({"bedrooms": {"$gt": 1}, "bathrooms": {"$gte": 1}})

// Usa un operador que filtre los documentos donde "bedrooms" **no** sea igual a 1
db.listingsAndReviews.find({"bedrooms": {"$ne": 1}})
