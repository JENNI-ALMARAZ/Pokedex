import React, { useEffect, useState } from 'react';

const PokemonCard = ({ pokemon }) => {
  const getStat = (name) => {
    const stat = pokemon.stats.find(s => s.stat.name === name);
    return stat ? stat.base_stat : 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-center">
      <img
        src={pokemon.sprites?.other['official-artwork'].front_default}
        alt={pokemon.name}
        className="w-32 h-32 mx-auto"
      />
      <h2 className="text-xl font-bold capitalize mt-2">{pokemon.name}</h2>

      <div className="flex justify-center gap-2 my-2">
        {pokemon.types.map(({ type }) => (
          <span
            key={type.name}
            className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
              type.name === 'fire' ? 'bg-red-500'
              : type.name === 'water' ? 'bg-blue-500'
              : type.name === 'grass' ? 'bg-green-500'
              : type.name === 'poison' ? 'bg-purple-500'
              : type.name === 'normal' ? 'bg-gray-500'
              : type.name === 'flying' ? 'bg-pink-500'
              : type.name === 'electric' ? 'bg-indigo-500'
              : type.name === 'bug' ? 'bg-yellow-500'
              : type.name === 'ground' ? 'bg-pink-500'
              : type.name === 'fairy' ? 'bg-red-500'
              : type.name === 'fighting' ? 'bg-pink-500'
              : type.name === 'psychic' ? 'bg-purple-500'
              : type.name === 'rock' ? 'bg-amber-500'
              : type.name === 'steel' ? 'bg-red-500'
              : type.name === 'ice' ? 'bg-green-500'
              : type.name === 'ghost' ? 'bg-purple-500'
              : 'bg-gray-500'
            }`}
          >
            {type.name}
          </span>
        ))}
      </div>

      {/* Estadísticas organizadas en dos columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-left mt-4">
        {['hp', 'attack', 'defense', 'special-attack'].map(stat => (
          <div key={stat}>
            <span className="capitalize font-medium">{stat.replace('-', ' ')}:</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min(getStat(stat),100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Nuevo estado para el término de búsqueda

  const fetchPokemons = async () => {
    setLoading(true);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);
    const data = await res.json();
    const promises = data.results.map(p => fetch(p.url).then(res => res.json()));
    const results = await Promise.all(promises);

    // Filtra los Pokémon ya presentes en la lista para evitar duplicados
    setPokemonList(prev => {
      const newPokemons = results.filter(newPokemon => 
        !prev.some(pokemon => pokemon.id === newPokemon.id)
      );
      return [...prev, ...newPokemons];
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase()); // Convertir el término de búsqueda a minúsculas
  };

  // Filtrar Pokémon basado en el término de búsqueda
  const filteredPokemonList = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Pokédex</h1>

      {/* Buscador en la parte superior */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          className="px-4 py-2 w-1/2 border rounded-lg"
          placeholder="Buscar Pokémon..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPokemonList.map(pokemon => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          onClick={() => setOffset(offset + 20)}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Cargar más'}
        </button>
      </div>
    </div>
  );
}
