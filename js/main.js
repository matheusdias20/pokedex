let pokemonListActive = document.querySelectorAll('.pokemon-filter-item');
for (let i=0; i<pokemonListActive.length; i++) {
    pokemonListActive[i].onclick = function() {
        let j = 0;
        while(j < pokemonListActive.length){
            pokemonListActive[j++].className = 'pokemon-filter-item';
        }
        pokemonListActive[i].className = "pokemon-filter-item pokemon-filter-item-active"
    }
}

const colors = {
    normal: '#AAA67F',
	fighting: '#C12239',
	ground: '#DEC16B',
	rock: '#B69E31',
	bug: '#A7B723',
    gost: '#70559B',
    fire: '#F57D31',
	water: '#6493EB',
	grass: '#74CB48',
	electric: '#F9CF30',
	psychic: '#FB5584',
	dragon: '#7037FF',
    fairy: '#E69EAC'
}

const main_types = Object.keys(colors)

async function fetchPokemonData(pokemons) {

    const allPokemonData= []
    
    for(const pokemon of pokemons) {
        const pokemonData = await fetchPokemon(pokemon.url)
        allPokemonData.push(pokemonData)
    }

    return allPokemonData
}

async function fetchPokemons() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=118&offset=0");
    const responseJSON = await response.json();

    return responseJSON.results
}

function insertPokemonHTML(pokemon) {
    const hpStat = pokemon.stats.find(item => item.stat.name === 'hp')
    const hpAttack = pokemon.stats.find(item => item.stat.name === 'attack')
    const hpDefense= pokemon.stats.find(item => item.stat.name === 'defense')
    const hpSpecialAttack= pokemon.stats.find(item => item.stat.name === 'special-attack')

    const poke_types = pokemon.types.map(type => type.type.name);
	const type = main_types.find(type => poke_types.indexOf(type) > -1);
	const color = colors[type];
    
    const pokemonHTML = `
        <li class="pokemons-item">
            <div class="pokemons-card" data-pokemon-type-name="electric">
                <div class="pokemons-card-image-container" style="background-color: ${color}">
                    <img src="${pokemon.sprites.other.dream_world.front_default}" alt="" class="pokemons-card-image">
                </div>

                <div class="pokemons-card-info">
                    <h3 class="pokemons-card-name">
                       ${pokemon.name}
                    </h3>

                    <span class="pokemons-card-type">
                        ${pokemon.types[0].type.name}
                    </span>
                </div>

                <ul class="pokemons-card-attributes">
                    <li class="pokemons-card-attributes-item">
                        <span class="pokemons-card-attributes-name">
                            HP
                        </span>
                        <div class="pokemons-card-attributes-progress">
                            <div class="pokemons-card-attributes-progress-bar" style="width: ${hpStat.base_stat}%">${hpStat.base_stat}%</div>
                        </div>
                    </li>

                    <li class="pokemons-card-attributes-item">
                        <span class="pokemons-card-attributes-name">
                            Attack
                        </span>
                        <div class="pokemons-card-attributes-progress">
                            <div class="pokemons-card-attributes-progress-bar" style="width: ${hpAttack.base_stat}%">${hpAttack.base_stat}%</div>
                        </div>
                    </li>

                    <li class="pokemons-card-attributes-item">
                        <span class="pokemons-card-attributes-name">
                            Defense
                        </span>
                        <div class="pokemons-card-attributes-progress">
                            <div class="pokemons-card-attributes-progress-bar" style="width: ${hpDefense.base_stat}%">${hpDefense.base_stat}%</div>
                        </div>
                    </li>

                    <li class="pokemons-card-attributes-item">
                        <span class="pokemons-card-attributes-name">
                            Special Attack
                        </span>
                        <div class="pokemons-card-attributes-progress">
                            <div class="pokemons-card-attributes-progress-bar" style="width: ${hpSpecialAttack.base_stat}%">${hpSpecialAttack.base_stat}%</div>
                        </div>
                    </li>
                </ul>
            </div>
        </li>

    `

    const pokemonListUl = document.querySelector('.pokemons-list')
    pokemonListUl.insertAdjacentHTML("beforeend", pokemonHTML)



	
	

}

async function fetchPokemon(url) {
    const response = await fetch(url);
    const responseJSON = await response.json();


    return responseJSON;
}

async function populatesPokemons(pokemons) {

    const allPokemonsData = await fetchPokemonData(pokemons)

    for(const allPokemonData of allPokemonsData) {
        insertPokemonHTML(allPokemonData)
    }
}

function removeAllPokemons () {
    const pokemonListUl = document.querySelector('.pokemons-list')
    pokemonListUl.innerHTML = ""
}

async function handleSearchInput(event, pokemons) {
    const value = event.target.value;

    if(!value) {
        removeAllPokemons()
       return await populatesPokemons(pokemons)
    }

    const currentPokemon = pokemons.find(pokemon => pokemon.name === value.toLowerCase())

    if(currentPokemon) {
        const currentPokemonData = await fetchPokemon(currentPokemon.url)

        if(currentPokemonData) {
            removeAllPokemons()
            insertPokemonHTML(currentPokemonData)
        }
    }else {
        alert("Não foi possível encontrar o pokemon")
    }

}

function initSearchFunction(pokemons) {
    const searchInput = document.querySelector(".search-input")

    searchInput.addEventListener("change", async (event) => await handleSearchInput(event, pokemons))
}

async function filterClicked(filter, pokemonsData) {
    const pokemonType = filter.dataset.pokemonTypeName
    const pokemonDataFilteredByType = pokemonsData.filter(pokemonData => {
        return pokemonData.types[0].type.name === pokemonType
    })

    
    if(pokemonType === "all"){
        removeAllPokemons();
        for(const pokemon of pokemonsData){
            insertPokemonHTML(pokemon)
        }
    } else {
        removeAllPokemons();

        for (const pokemon of pokemonDataFilteredByType) {
            insertPokemonHTML(pokemon)
        }
    }

}

// function changeBackgroundColor() {
//     const imageContainer = document.querySelector(".pokemons-card-image-container")
//     console.log(ima)
// }

function initFiltersFunction(pokemonsData) {
    const filters = document.querySelectorAll(".pokemon-filter-button")
    filters.forEach(filter => {
        filter.addEventListener("click", async () => await filterClicked(filter, pokemonsData))
    })
}

async function main() {

    const pokemons = await fetchPokemons();
    const pokemonsData = await fetchPokemonData(pokemons)

    initSearchFunction(pokemons)
    initFiltersFunction(pokemonsData)

    populatesPokemons(pokemons)
}

main();
