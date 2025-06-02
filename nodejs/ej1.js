const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);
const COLLECTION = 'decks';

//addDeck()


/*
{
    "name": "Spider-Man rocks!",
    "description": "The description",
    "hero": "01001",
    "cards": {
        "01002": 1,
        "01084": 1,
        "01071": 2,
        "01005": 3,
        "01086": 1
    },
    OPCIONAL
    "algo": [
    { "nota": "Ejemplo", "puntos": 10 },
    { "nota": "Otra cosa", "puntos": 20 }
  ],
  "algo2": ["uno", "dos", "tres"],
  personajes": [
    {
      "nombre": "Iron Man",
      "habilidades": ["Volar", "Tecnología"]
    },
    {
      "nombre": "Hulk",
      "habilidades": ["Fuerza", "Regeneración"]
    }
  ],
  "stock": {
    "card01001": 10,
    "card01002": 3,
    "card01005": 7
  },
  "configuracion": {
    "juego": {
      "modo": "experto",
      "maxJugadores": 4
    },
    "interfaz": {
      "tema": "oscuro"
    }
  },
  "jugadores": [
    { "id": "u123", "nombre": "Paco", "activo": true },
    { "id": "u124", "nombre": "Ana", "activo": false }
  ]
}
    "_id": "68335fd88e935bc7b1317b90"
}


*/
router.post('/', async (req, res) => {
  const db = dbo.getDb();
  const { name, description, hero, cards, algo, algo2, personajes,stock,configuracion, jugadores } = req.body;
  console.log(req.body);

  console.log(req.body.cards, "caaards")

  // EL objeto JSON debe contener todas las propiedades:
  //description puede aceptar strings o null
  if (!name || (description !== null && typeof description !== 'string') || !hero || !cards || typeof cards !== 'object') {
    return res.status(405).json({ code: 1, message: 'Invalid input 1' });
  }

  try {
    // cada mazo de cartas esta compuesto por una unica carta de hero
    const heroCard = await db.collection('cards').findOne({ _id: hero, type: 'hero' });
    if (!heroCard) {
      return res.status(405).json({ code: 1, message: 'Invalid input 2' });
    }

    // 5 cartas que no son de type hero
    const cardIds = Object.keys(cards);
    console.log(cardIds, "id cartasss")
    if (cardIds.length < 5) {
      return res.status(405).json({ code: 1, message: 'Invalid input 3' });
    }

    // Validar cada carta
    for (const cardId of cardIds) {
      const count = cards[cardId];
      console.log(count, "cooount")
      if (typeof count !== 'number' || count < 1 || count > 3) {
        return res.status(405).json({ code: 1, message: 'Invalid input 4' });
      }
      // de las 5 cartas,  que ninguna sea  de type hero
      const card = await db.collection('cards').findOne({ _id: cardId });
      if (!card || card.type === 'hero') {
        return res.status(405).json({ code: 1, message: 'Invalid input 5' });
      }
    }

    // Validar 'algo'
if (algo && Array.isArray(algo)) {
  for (let i = 0; i < algo.length; i++) {
    const item = algo[i];
    console.log(`algo[${i}] => nota: ${item.nota}, puntos: ${item.puntos}`);

    if (typeof item !== 'object' || !item.nota || typeof item.nota !== 'string' || typeof item.puntos !== 'number') {
      return res.status(405).json({ code: 1, message: `Invalid algo[${i}] format` });
    }
  }
}

// Validar 'algo2'
if (algo2 && Array.isArray(algo2)) {
  for (let i = 0; i < algo2.length; i++) {
    const val = algo2[i];
    console.log(`algo2[${i}] = ${val}`);
    if (typeof val !== 'string' || val.length < 1) {
      return res.status(405).json({ code: 1, message: `Invalid algo2[${i}]` });
    }
  }
}


// Validar 'personajes'
    if (personajes && Array.isArray(personajes)) {
      for (const personaje of personajes) {
        console.log(`personajes[${personaje}] => nombre: ${personaje.nombre}, habilidades: ${personaje.habilidades}`);
        if (typeof personaje.nombre !== 'string' || !Array.isArray(personaje.habilidades)) {
          return res.status(405).json({ code: 1, message: 'Invalid personaje format' });
        }
      }
    }

    // Validar 'stock'
    if (stock && typeof stock === 'object') {
      for (const [key, value] of Object.entries(stock)) {
        console.log("stock", "key ", key, "values ", value);
        if (typeof value !== 'number' || value < 0) {
          return res.status(405).json({ code: 1, message: `Invalid stock entry for ${key}` });
        }
      }
    }

    // Validar 'configuracion'
    if (configuracion) {
      const { juego, interfaz } = configuracion;
      console.log("configuracion, " , "juego ", juego, "interfaz", interfaz );

      console.log("juego", "juego modo ", juego.modo, "juego Max jugadofes ", juego.maxJugadores )

      console.log("interfaz", "interaztema", interfaz.tema);
      if (!juego || typeof juego.modo !== 'string' || typeof juego.maxJugadores !== 'number') {
        return res.status(405).json({ code: 1, message: 'Invalid configuracion.juego' });
      }
      if (!interfaz || typeof interfaz.tema !== 'string') {
        return res.status(405).json({ code: 1, message: 'Invalid configuracion.interfaz' });
      }
    }

    // Validar 'jugadores'
    if (jugadores && Array.isArray(jugadores)) {

      for (const j of jugadores) {
        console.log("jugadores", j.id, j.nombre, j.activo);
        if (typeof j.id !== 'string' || typeof j.nombre !== 'string' || typeof j.activo !== 'boolean') {
          return res.status(405).json({ code: 1, message: 'Invalid jugador' });
        }
      }
    }

    // Crear el deck
    const newDeck = {
      name,
      description,
      hero,
      cards,
      algo,
      algo2,
      personajes,
      stock,
      configuracion,
      jugadores
    };

    const result = await db.collection(COLLECTION).insertOne(newDeck);
    res.status(200).json({newDeck, _id: result.insertedId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 1, message: 'Invalid input catch' });
  }
});


/*

[
  {
    "name": "Deck 1",
    "description": "Desc 1",
    "hero": "01001",
    "cards": {
      "01002": 1,
      "01084": 1,
      "01071": 2,
      "01005": 3,
      "01086": 1
    }
  },
  {
    "name": "Deck 2",
    "description": "Desc 2",
    "hero": "01040",
    "cards": {
      "01002": 2,
      "01084": 1,
      "01071": 1,
      "01005": 2,
      "01086": 1
    }
  }
]


*/
//insertMany, Siempre espera un array

router.post('/bulk', async (req, res) => {
  const db = dbo.getDb();
  const decks = req.body;

  if (!Array.isArray(decks) || decks.length === 0) {
    return res.status(400).json({ code: 1, message: 'Invalid input: Must be an array of decks' });
  }

  try {
    await db.collection(COLLECTION).insertMany(decks);
    res.status(200).json({ message: 'Decks inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 1, message: 'Insertion error' });
  }
});


/*

UPDATE ONE
{
  "description": "Updated description",
  "name": "Deck Modificado"
}

*/
router.put('/:id', async (req, res) => {
  const db = dbo.getDb();
  const deckId = req.params.id;
  const updateData = req.body;

  try {
    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(deckId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ code: 1, message: 'Deck not found' });
    }

    res.status(200).json({ message: 'Deck updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 1, message: 'Update error' });
  }
});


//UPDATE MANY

/*

{
  "filter": { "description": "Desc 1" },
  "update": { "description": "Actualizada wei" }
}


TAMBINE VALE PARA VARIOS CAMPOS

{
  "filter": {
    "description": "Desc 1",
    "hero": "01001",
    "name": "Spider-Man rocks!"
  },
  "update": {
    "description": "Actualizada wey"
  }
}


*/
router.put('/', async (req, res) => {
  const db = dbo.getDb();
  const { filter, update } = req.body;

  try {
    const result = await db.collection(COLLECTION).updateMany(filter, { $set: update });
    res.status(200).json({ message: `${result.modifiedCount} decks updated` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 1, message: 'Bulk update error' });
  }
});


//replaceOne, sustituye el documento completo, debe contener todos los campos obligatorios 


/*


{
  "name": "Deck Reemplazado",
  "description": "Reemplazado completamente",
  "hero": "01001",
  "cards": {
    "01002": 1,
    "01084": 1,
    "01071": 2,
    "01005": 3,
    "01086": 1
  }
}

*/



router.put('/replace/:id', async (req, res) => {
  const db = dbo.getDb();
  const deckId = req.params.id;
  const newDoc = req.body;

  try {
    const result = await db.collection(COLLECTION).replaceOne(
      { _id: new ObjectId(deckId) },
      newDoc
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ code: 1, message: 'Deck not found' });
    }

    res.status(200).json({ message: 'Deck replaced successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 1, message: 'Replace error' });
  }
});





// DELETE /deck/:id



router.delete('/:id', async (req, res) => {
  const db = dbo.getDb();
  const deckId = req.params.id;

  if (!ObjectId.isValid(deckId)) {
    return res.status(400).json({ code: 1, message: 'Invalid ID format' });
  }

  try {
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(deckId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ code: 1, message: 'Deck not found' });
    }

    res.status(200).json({ message: 'Deck deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 1, message: 'Delete error' });
  }
});



// DELETE /deck/batch
router.delete('/batch', async (req, res) => {
  const db = dbo.getDb();

  try {
    const result = await db.collection(COLLECTION).deleteMany({ description: null });

    res.status(200).json({
      message: `Deleted ${result.deletedCount} decks with description: null`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 1, message: 'Batch delete error' });
  }
});


//si quieres borrar varios documentos filtrando por varios campos


/*
{
  "filter": {
    "hero": "01001",
    "name": "Spider-Man rocks!"
  }
}



*/

router.delete('/batch', async (req, res) => {
  const db = dbo.getDb();
  const { filter } = req.body;

  try {
    const result = await db.collection(COLLECTION).deleteMany(filter);

    res.status(200).json({
      message: `Deleted ${result.deletedCount} decks`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 1, message: 'Batch delete error' });
  }
});

module.exports = router;
