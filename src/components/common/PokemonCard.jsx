
import toUpperCase from "../../utils/upperCaseName"
import { getPokemonColor } from "../../utils/pokemonColors"

export default function PokemonCard({ pokemons, showModal, colors }) {
  if (!pokemons || pokemons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No Pokémon found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {pokemons.map((pokemon) => (
        <div
          key={pokemon.id}
          className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-blue-300 p-3 sm:p-4 flex flex-col items-center min-h-[160px] sm:min-h-[180px]"
          style={{
            backgroundColor: getPokemonColor(pokemon),
          }}
          onClick={() => showModal(pokemon.id, pokemon.name)}
        >
          {/* Pokemon Image */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-2 sm:mb-3 flex items-center justify-center bg-gray-100 rounded-lg">
            {pokemon?.sprites?.other?.dream_world?.front_default || pokemon?.sprites?.front_default ? (
              <img
                src={pokemon.sprites.other?.dream_world?.front_default || pokemon.sprites.front_default}
                alt={pokemon.name || 'Pokemon'}
                className="object-contain w-full h-full"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Pokemon Info */}
          <div className="text-center flex-1 flex flex-col justify-end">
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-1 truncate w-full leading-tight">
              {toUpperCase(pokemon.name)}
            </h3>
            <span className="text-xs text-gray-600 font-medium">
              #{pokemon.id.toString().padStart(3, '0')}
            </span>
          </div>
          
          {/* Type Badge */}
          {pokemon.types && pokemon.types.length > 0 && (
            <div className="mt-1 sm:mt-2 flex flex-wrap gap-1 justify-center">
              {pokemon.types.slice(0, 1).map((typeInfo, index) => (
                <span 
                  key={index}
                  className="inline-block px-1.5 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full"
                >
                  {toUpperCase(typeInfo?.type?.name || typeInfo)}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
