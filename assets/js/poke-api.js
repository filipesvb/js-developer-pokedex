

const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;
    pokemon.hp = pokeDetail.stats[0].base_stat;

    const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name);
    const [ability] = abilities;

    pokemon.baseExp = pokeDetail.base_experience;

    pokemon.abilities = abilities;
    pokemon.ability = ability;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;      // entre colchetes representa o primeiro indice do array referido (Array Destructuring)

    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = pokeDetail.sprites.other['official-artwork'].front_default;

    return pokemon;
}

pokeApi.getPokemonsDetails = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then((pokemon) => convertPokeApiDetailToPokemon(pokemon))
    
}

pokeApi.getPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    return fetch(url)  //interface da Promise
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)  
        .then((pokemons) => pokemons.map(pokeApi.getPokemonsDetails))
        .then((detailRequests) => Promise.all(detailRequests))
        // .catch((error) => console.error(error))
}

pokeApi.listAllPokemon = (pokemon) => {
    let pokemonAll = [];
    let pokemons = pokemon.map((pokemon) => pokemonAll.push(pokemon))
    

    return pokemonAll;
}
