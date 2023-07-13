const { Router } = require('express');
const axios = require ('axios');
const { Pokemon, Type } = require('../db')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
const getApiInfo = async () => {
    const apiUrl = await axios.get('https://pokeapi.co/api/v2/pokemon');
    const apiInfo = await apiUrl.data.map(el => {
        return {
            id: el.id,
            nombre: el.nombre,
            imagen: el.imagen,
            vida: el.vida,
            ataque: el.ataque,
            defensa: el.defensa,
            velocidad: el.velocidad,
            altura: el.altura,
            peso: el.peso
            
        };
    });
    return apiInfo;
};

const getDbInfo = async () => {
    return await Pokemon.findAll({
        include:{
            model:Type,
            attributes: ['name'],
            through: {
                attributes: [],
            },
        }
    })
}

const getAllPokemon = async () => {
    const apiInfo = await getApiInfo();
    const dbInfo = await getDbInfo();
    const infoTotal = apiInfo.concat(dbInfo);
    return infoTotal
}

router.get('/', async (req, res) => {
    const name = req.query.name
    let allPokemons = await getAllPokemon();
    if (name) {
        let pokemonName = await allPokemons.filter(p => p.name.toLowerCase().includes(name.toLowerCase())) //compara los dos nombre en minusula para que no haya errores
        pokemonName.length ?
        res.status(200).send(pokemonName) :
        res.status(404).send('No esta el personaje');
    } else {
        res.status(200).send(allPokemons)
    }
})

router.get('/:idPokemon', async (req, res) => {
    
})


module.exports = router;
