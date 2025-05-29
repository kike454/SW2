

# Uso de $elemMatch en MongoDB

## Descripción

`$elemMatch` permite aplicar múltiples condiciones dentro del mismo subdocumento de un array. Es útil cuando necesitamos que varias condiciones se cumplan en un mismo elemento del array, no en cualquier parte del array.

## Consultas

```js


DOCUMENTO 

{

_id: ObjectId('56d5f7eb604eb380b0d8d8d6'),

student_id: 0,

scores: [

{ type: 'exam', score: 25.926204502143857 },

{ type: 'quiz', score: 37.23668404170315 },

{ type: 'homework', score: 19.609679551976487 },

{ type: 'homework', score: 98.7923690220697 }

],

class_id: 108

}
// scores con score > 85
db.grades.find({"scores": { "$elemMatch": {"score": {"$gt": 85}} }}).count()

// scores con type = exam y score > 85
db.grades.find({"scores": { "$elemMatch": {"score": {"$gt": 85}, "type": "exam"} }}).count()


DOCUMENTO


relationships: [

{

is_past: false,

title: 'Co-Founder and VP, Social and Audience Development',

person: {

first_name: 'Michael',

last_name: 'Howell',

permalink: 'michael-howell'

}

},

{

is_past: false,

title: 'Co-Founder/CEO/Board of Directors',

person: {

first_name: 'Ben',

last_name: 'Elowitz',

permalink: 'ben-elowitz'

}

},

{

is_past: false,

title: 'COO/Board of Directors',

person: { first_name: 'Rob', last_name: 'Grady', permalink: 'rob-grady' }

},

// Nombre de la compañía con persona Mark y título CEO
db.companies.find({
  "relationships": {
    "$elemMatch": {
      "title": "CEO",
      "person.first_name": "Mark"
    }
  }
}, { "name": 1, "_id": 0 })
