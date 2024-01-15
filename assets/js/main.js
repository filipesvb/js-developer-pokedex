
const pokemonList = document.getElementById(`pokemonList`);
const loadMoreButton = document.getElementById(`loadMoreButton`);
const modal = document.getElementById('modal');

const listOffAllPokemon = [];

const maxRecords = 151;
const limit = 10;
let offset = 0;

// 1, 2, 3, 4, 5       0 - 5
// 6, 7, 8, 9, 10      5 - 5
// 11,                 10 - 5 (remove o botao)


function convertPokemonToHtml(pokemon) {
    return ` 
        <li class="pokemon ${pokemon.type}">

            <div class="bg_pokeball">
                <div class="pokeballLine ${pokemon.type}""></div>
            </div>

            <span class="number">${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img id="imagePoke" src="${pokemon.photo}"
                    alt="${pokemon.name}">
            </div>

        </li>
    `
}



function loadPokemonsItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {  //pega uma array, com as listas de detalhes de cada pokemon

        const newList = pokemons.map((pokemon) => convertPokemonToHtml(pokemon))  //recebe a lista das listas de detalhes,
                                                                                //e transforma cada item em uma 'li' de html
    
        const newHtml = newList.join('');
    
        pokemonList.innerHTML += newHtml;


        pokeApi.listAllPokemon(pokemons).map((pokemon) => listOffAllPokemon.push(pokemon));
     
        const pokemonSingleCollection = document.querySelectorAll('.pokemon');

        for(let i = 0; i < listOffAllPokemon.length; i++) {
            pokemonSingleCollection[i].addEventListener("click", () => {
                const newModal = pokemonDetailsToModal(listOffAllPokemon[i]);
                modal.innerHTML = newModal;
                modal.style.display = "block";
            })
            
        } 
        
        modal.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    
        // ### Esse codigo sendo diminuido mais ainda:
        // pokeApi.getPokemons().then((pokemons = []) => {
        //     pokemonList.innerHTML += pokemons.map(convertPokemonToHtml).join('');
        // })
    

        // ### Esse codigo escrito sem a funcao .map:
        // const listItems = [];
        // for (let i = 0; i < pokemons.length; i++) {
        //         const pokemon = pokemons[i];
        //         listItems.push(convertPokemonToHtml(pokemon))
        // }  
        //
        // pokemonList.innerHTML += listItems;
    
    })

    
}

loadPokemonsItems(offset, limit);

loadMoreButton.addEventListener("click", () => {
    offset += limit;
    const qtdRecordNextPage = offset + limit;

    if(qtdRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonsItems(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonsItems(offset, limit)
    }

})

function pokemonDetailsToModal(pokemon) {
    return `
    <div class="modal-content ${pokemon.type}">

        <span class="close">&#8592;</span>

        <div class="pokemon_presentation">
            <span style="font-size: 14px">#${pokemon.number}</span>
            <span class="modal-name">${pokemon.name}</span>
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${pokemon.type}">${type}</li>`).join('')}
            </ol>
            <img src="${pokemon.photo}" />
        </div>

        <div class="pokemon_details">

            <div class="general_info">

                <div class="line1">
                    <div class="title">
                        <p>Abilities</p>
                    </div>
                    <div class="data">
                            ${pokemon.abilities.map((ability) => `<span class="ability"> ${ability}</span>`).join()}
                    </div>
                </div>

                <div class="line2">
                    <div class="title">
                        <p>Base EXP</p>
                    </div>
                    <div class="data">
                        <span>${pokemon.baseExp}</span>
                    </div>
                </div>
            </div><!--general_info-->

        </div>
    </div>
    `
}
