const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);
const COLLECTION = 'cards';

//getCards()
router.get('/', async (req, res) => {
  let limit = MAX_RESULTS;
  if (req.query.limit){
    limit = Math.min(parseInt(req.query.limit), MAX_RESULTS);
  }
  let next = req.query.next;
  let query = {}
  if (next){
    query = {_id: {$lt: next}}
  }
  const dbConnect = dbo.getDb();
  let results = await dbConnect
    .collection(COLLECTION)
    .find(query)
    .project({_id:1, name:1, type:1})
    .sort({_id: -1})
    .limit(limit)
    .toArray()
    .catch(err => res.status(400).send('Error searching for cards'));
  next = results.length == limit ? results[results.length - 1]._id : null;
  res.json({results, next}).status(200);
});

//filtrar cartas segun el tipo (hero, event, ally)
//postman http://localhost:3000/api/cards?type=hero

/*
router.get('/cards', async (req, res) => {
  const db = dbo.getDb();
  const { type } = req.query;

  const validTypes = ['hero', 'event', 'ally'];
  const filter = {};

  if (type) {
    if (!validTypes.includes(type)) {
      return res.status(400).json({ code: 1, message: 'Invalid type filter' });
    }
    filter.type = type;
  }

  try {
    const results = await db.collection('cards').find(filter).toArray();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 1, message: 'Database error' });
  }
});
*/
//limit: Es el número máximo de resultados que quieres que te devuelva la base de datos.
//GET /api/card/cards?limit=3
//devuelev 3 cartas

//offset: Te dice cuántos resultados debes saltar desde el principio, como si pasaras páginas.

//GET /api/card/cards?limit=3&offset=2, esto salta las 2 primeras cartas y luego devuelve las siguientes 3 cartas.

//http://localhost:3000/api/card/cards?limit=3&offset=2

// si quieres solo probar los limites, http://localhost:3000/api/card/cards?limit=3
// si quieres solo probar el  offset,  http://localhost:3000/api/card/cards?offset=2

//las 3 cosas
//http://localhost:3000/api/card/cards?type=hero&limit=2&offset=1

router.get('/cards', async (req, res) => {
  const db = dbo.getDb();
  const { type, limit, offset } = req.query;

  const validTypes = ['hero', 'event', 'ally'];
  const filter = {};

  if (type) {
    if (!validTypes.includes(type)) {
      return res.status(400).json({ code: 1, message: 'Invalid type filter' });
    }
    filter.type = type;
  }

  const lim = parseInt(limit);
  const off = parseInt(offset);

  try {
    const cursor = db.collection('cards').find(filter);

    if (!isNaN(off)) cursor.skip(off);
    if (!isNaN(lim)) cursor.limit(Math.min(Math.max(lim, 1), 100)); // seguridad

    const results = await cursor.toArray();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 1, message: 'Database error' });
  }
});

//getCardById()
router.get('/:id', async (req, res) => {
  const dbConnect = dbo.getDb();
  let query = {_id: req.params.id};
  let result = await dbConnect
    .collection(COLLECTION)
    .findOne(query);
  if (!result){
    res.send("Not found").status(404);
  } else {
    res.status(200).send(result);
  }
});

//addCard()
router.post('/', async (req, res) => {
  const dbConnect = dbo.getDb();
  console.log(req.body);
  let result = await dbConnect
    .collection(COLLECTION)
    .insertOne(req.body);
  res.status(201).send(result);
});

//deleteCardById()
router.delete('/:id', async (req, res) => {
  const query = { _id: req.params.id };
  const dbConnect = dbo.getDb();
  let result = await dbConnect
    .collection(COLLECTION)
    .deleteOne(query);
  res.status(200).send(result);
});


//offset







router.get('/cards', async (req, res) => {
  const db = dbo.getDb();
  const { type, limit, offset } = req.query;

  const validTypes = ['hero', 'event', 'ally'];
  const filter = {};

  if (type) {
    if (!validTypes.includes(type)) {
      return res.status(400).json({ code: 1, message: 'Invalid type filter' });
    }
    filter.type = type;
  }

  const lim = parseInt(limit);
  const off = parseInt(offset);

  try {
    const cursor = db.collection('cards').find(filter);

    if (!isNaN(off)) cursor.skip(off);
    if (!isNaN(lim)) cursor.limit(Math.min(Math.max(lim, 1), 100)); // seguridad

    const results = await cursor.toArray();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 1, message: 'Database error' });
  }
});


module.exports = router;
