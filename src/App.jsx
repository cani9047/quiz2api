import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function PokemonDex() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const getPokemonList = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151');
      setPokemonList(response.data.results);
    } catch (error) {
      console.error("Error fetching Pokémon list:", error);
    }
  };

  const getPokemonDetails = async (url) => {
    try {
      const response = await axios.get(url);
      const species = await axios.get(response.data.species.url); // Fetch species data for type
      const pokemon = {
        name: response.data.name.toUpperCase(),
        sprites: response.data.sprites.front_default,
        types: response.data.types.map((typeInfo) => typeInfo.type.name),
        stats: response.data.stats.reduce((acc, stat) => {
          acc[stat.stat.name] = stat.base_stat;
          return acc;
        }, {}),
      };
      setSelectedPokemon(pokemon);
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>API Pokemon</h1>
      <button onClick={getPokemonList}>Get Pokémon Dex</button>
      
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
        <div style={{ marginRight: '20px' }}>
          {pokemonList.length > 0 && (
            <ul>
              {pokemonList.map((pokemon, index) => (
                <li key={index} onClick={() => getPokemonDetails(pokemon.url)} style={{ cursor: 'pointer' }}>
                  {pokemon.name.toUpperCase()}
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedPokemon && (
          <div style={{ backgroundColor: '#a8e6a2', padding: '10px', borderRadius: '8px', width: '250px' }}>
            <img src={selectedPokemon.sprites} alt={selectedPokemon.name} />
            <h3>Name: {selectedPokemon.name}</h3>
            <p>Type 1: {selectedPokemon.types[0]}</p>
            <p>Type 2: {selectedPokemon.types[1] || 'N/A'}</p>
            <h4>Base stats:</h4>
            <ul>
              {Object.entries(selectedPokemon.stats).map(([key, value]) => (
                <li key={key}>{key} = {value}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default PokemonDex;
