


# $expr , Dot Notation  , $size y $all en MongoDB

## $expr

Permite comparar campos dentro del mismo documento.

## $all

Para buscar arrays que contengan al menos esos elementos

## $size

para contar el numero de elementos de un array

### Consultas

```js
// Edad mayor que años de experiencia
{ "$expr": { "$gt": [ "$edad", "$años_experiencia" ] }}

// Busca viajes donde el ID de estación de inicio y el de final sean el  mismo.
db.trips.find({"$expr": {"$eq": ["$start station location", "$end station location"]}}).count()

//Busca viajes donde la duración sea mayor a 1200 segundos y la estación de inicio y fin sean iguales.
db.trips.find({ "$expr": {
  "$and": [
    { "$gt": ["$tripduration", 1200] },
    { "$eq": ["$end station id", "$start station id"] }
  ]}
}).count()

ALL


//$all: Para buscar arrays que contengan al menos esos elementos

db.listingsAndReviews.find({"amenities": {"$all": [ "Essentials", "Wifi", "Kitchen"] }});

SIZE

//$size: para contar el numero de elementos de un array

//Busca alojamientos con exactamente 50 amenities.

db.listingsAndReviews.find({"amenities": {"$size": 50}});
