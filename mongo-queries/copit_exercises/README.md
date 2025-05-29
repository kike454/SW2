
# Ejercicios COPIT MongoDB

## COPIT Exercises v1 & v2

```js
// En sample_training.zips ¿Cuántas colecciones tienen  menos de 1000 personas en el campo pop? (sol. 8065)
db.zips.find({"pop": {"$lt": 1000}}).count()

// En sample_training.trips ¿Cuál es la diferencia entre la  gente que nació en 1998 y la que nació después de 1998?
db.trips.find({"birth year": {"$gt": 1998 }}).count() - db.trips.find({"birth year": {"$eq": 1998 }}).count()

// En sample_training.routes ¿Cuántas rutas tienen al menos  una parada?
db.routes.find({"stops": {"$gt": 0}}).count()

// En sample_training.inspections ¿Cuántos negocios  tienen un resultado de inspección "Out of Business" y  pertenecen al sector "Home Improvement Contractor -  100"?
db.inspections.find({"result": "Out of Business", "sector": "Home Improvement Contractor - 100"}).count()

//CON AND EXPLICITO
db.inspections.find({"$and": [{"result": "Out of Business"}, {"sector": "Home Improvement Contractor - 100" } ] }).count()


// En sample_training.inspections ¿Cuántos documentos  hay con fecha de inspección "Feb 20 2015" o "Feb 21 2015" y  cuyo sector no sea "Cigarette Retail Dealer - 127"?
db.inspections.find({ "$and": [
  { "$or": [{ "date": "Feb 20 2015" }, { "date": "Feb 21 2015" }] },
  { "sector": { "$ne": "Cigarette Retail Dealer - 127" }}
]}).count()



V2



Documento:  

property_type: 'Apartment',

amenities: [

'Wifi',

'Wheelchair accessible',

'Kitchen',

'Free parking on premises',

'Smoking allowed',

'Hot tub',

'Buzzer/wireless intercom',

'Family/kid friendly',

'Washer',

'First aid kit',

'Essentials',

'Hangers',

'Hair dryer',

'Iron',

'Laptop friendly workspace'

],
//En sample_airbnb.listingsAndReviews, ¿cuántos  documentos tienen el "property_type" "House" e incluyen  "Changing table" como una de las "amenities"?
db.listingsAndReviews.find({"$and": [{"property_type": "House"}, {"amenities":"Changing table"}]}).count()





// Empresas con más empleados que el año fundado
db.companies.find({"$expr": {"$gt": ["$number_of_employees", "$founded_year"]}}).count()

// Empresas con mismo permalink y twitter_username
db.companies.find({"$expr": {"$eq": ["$permalink", "$twitter_username"]}}).count()



DOT


DOCUMENTO:  
offices: [

{

description: '',

address1: '710 - 2nd Avenue',

address2: 'Suite 1100',

zip_code: '98104',

city: 'Seattle',

state_code: 'WA',

country_code: 'USA',

latitude: 47.603122,

longitude: -122.333253

},

{

description: '',

address1: '270 Lafayette Street',

address2: 'Suite 505',

zip_code: '10012',

city: 'New York',

state_code: 'NY',

country_code: 'USA',

latitude: 40.7237306,

longitude: -73.9964312

}

],

// Empresas con oficinas en Seattle
db.companies.find({"offices.city": "Seattle"}).count()

//otra manera

db.companies.find({"offices": {"$elemMatch": {"city": "Seattle"}}}).count()

// Viajes desde estaciones al oeste de longitud -74
db.trips.find({ "start station location.coordinates": { "$lt": -74 } }).count()



DOCUMENTO 

{

_id: ObjectId('56d61033a378eccde8a8354f'),

id: '10021-2015-ENFO',

certificate_number: 9278806,

business_name: 'ATLIXCO DELI GROCERY INC.',

date: 'Feb 20 2015',

result: 'No Violation Issued',

sector: 'Cigarette Retail Dealer - 127',

address: { city: 'RIDGEWOOD', zip: 11385, street: 'MENAHAN ST', number: 1712 }

}
// Inspecciones en NEW YORK
db.inspections.find({"address.city": "NEW YORK"}).count()

//otra manera 

db.inspections.find({ "address": { "$elemMatch": { "city": "NEW YORK" }}}).count()


// Alojamientos con "Internet" como primer amenity
db.listingsAndReviews.find({"amenities.0": "Internet"}, {"name": 1, "address": 1, "_id": 0})


SIZE

// En sample_airbnb.listingsAndReviews, ¿cuál es el nombre  del alojamiento en el que pueden estar más de 6 personas  alojadas y tiene exactamente 50 reviews?
db.listingsAndReviews.find({"$and": [{"accommodates":{ "$gt": 6}}, {"reviews": {"$size": 50}}]}, {"name": 1})


/
// El nombre de empresas con exactamente 8 funding_rounds
db.companies.find({"funding_rounds": {"$size": 8}}, {"name": 1})

