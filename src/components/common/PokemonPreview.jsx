import { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectLoading,
  selectPokemonDetails,
  selectSelectedPokemon,
} from "../../store/pokemonSlice";
import generateRandom from "../../utils/generateRandomColors";
import { getPokemonColor } from "../../utils/pokemonColors";
import toUpperCase from "../../utils/upperCaseName";
import {
  convertHeight,
  descriptionList,
  flattenList,
  simplifyLabels,
} from "../../utils/utils";

export default function PokemonPreview({ close }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedPokemon = useSelector(selectSelectedPokemon);
  const pokemonDetails = useSelector(selectPokemonDetails);
  const loading = useSelector(selectLoading);

  if (!selectedPokemon) {
    return null;
  }

  if (loading.details) {
    return (
      <div className="flex items-center justify-center min-h-screen md:min-h-[400px] p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const abilities = (data = []) =>
    data.map((item) => toUpperCase(item.ability.name));

  const handleReadMore = () => setIsModalOpen((prev) => !prev);

  return (
    <section className="p-4 sm:p-6 text-gray-800 w-full bg-white min-h-screen md:min-h-0 md:rounded-lg">
      <div className="relative mb-6 flex flex-col md:flex-row md:gap-6">
        <div className="flex justify-center md:justify-start mb-4 md:mb-0">
          <div
            className={`w-48 h-48 md:w-56 md:h-64 p-4 bg-cover rounded-lg border-2 border-gray-300 flex items-center justify-center ${
              selectedPokemon?.types?.length > 1
                ? "bg-gradient-to-b from-blue-100 to-purple-100"
                : ""
            }`}
            style={{
              backgroundColor: getPokemonColor(selectedPokemon),
            }}
          >
            <img
              src={selectedPokemon?.sprites?.other?.dream_world?.front_default}
              alt={selectedPokemon.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {selectedPokemon?.name?.toUpperCase()}
                </h2>
                <div className="text-xl md:text-2xl text-gray-600 font-medium">
                  #{selectedPokemon.id.toString().padStart(3, "0")}
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="mb-6">
            <div className="text-sm md:text-base leading-relaxed text-gray-700">
              {descriptionList(
                pokemonDetails.description?.flavor_text_entries
              )?.substring(0, 300) || "No description available."}
              ...
              <span
                className="font-bold underline cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={handleReadMore}
              >
                read more
              </span>
              {isModalOpen && (
                <>
                  <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-40"
                    onClick={handleReadMore}
                  />
                  <div
                    className="fixed inset-2 sm:inset-4 md:absolute md:inset-auto md:left-0 md:right-0 md:top-full md:mt-2 p-3 sm:p-4 pt-8 rounded-lg z-50 shadow-xl border border-gray-700 max-h-[80vh] overflow-y-auto"
                    style={{ backgroundColor: "#1f2937", color: "white" }}
                  >
                    <button
                      type="button"
                      onClick={handleReadMore}
                      className="absolute top-2 right-2 p-1 hover:bg-gray-700 rounded"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <p className="text-sm sm:text-base leading-relaxed">
                      {descriptionList(
                        pokemonDetails.description?.flavor_text_entries
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="text-[16px] mt-5 grid grid-cols-2 pb-4 gap-y-8 sm:grid-cols-4">
        <div>
          <h3 className="font-bold pb-2  leading-[25px]">Height</h3>
          <p>{convertHeight(selectedPokemon.height)}</p>
        </div>
        <div>
          <h3 className="font-bold pb-2 text-[16px] leading-[25px]">Weight</h3>
          <p>{selectedPokemon.weight / 10} kg</p>
        </div>
        <div>
          <h3 className="font-bold pb-2 text-[16px] leading-[25px]">Gender</h3>
          <p>{pokemonDetails.gender?.gender?.join(", ") || "Unknown"}</p>
        </div>
        <div>
          <h3 className="font-bold pb-2 text-[16px] leading-[25px]">
            Egg Groups
          </h3>
          {flattenList(pokemonDetails.description?.egg_groups).join(", ") ||
            "Unknown"}
        </div>
      </div>
      <div className="mt-5 mb-12 grid grid-cols-2 gap-y-8 sm:grid-cols-4">
        <div>
          <h3 className="font-bold text-[16px] pb-2 leading-[25px]">
            Abilities
          </h3>
          <p className="text-sm">
            {abilities(selectedPokemon.abilities).join(", ")}
          </p>
        </div>
        <div>
          <h3 className="font-bold text-[16px] pb-2 leading-[25px]">Types</h3>
          <p>
            {selectedPokemon?.types?.map(({ type }) => (
              <span
                key={type}
                className="w-[28px] h-[25px] text-[16px] font-normal p-[2px] rounded mx-[2px] border"
                style={{
                  background: generateRandom(),
                }}
              >
                {toUpperCase(type.name)}
              </span>
            ))}
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-[16px] pb-2 leading-[25px]">
            Weak Against
          </h3>
          <p>
            {pokemonDetails.disabilities?.damage_relations?.double_damage_from?.map(
              ({ name }) => (
                <span
                  key={name}
                  className="w-[28px] h-[25px] text-[16px] font-normal text-sm p-[2px] rounded mx-[2px] border"
                  style={{
                    background: generateRandom(),
                  }}
                >
                  {toUpperCase(name)}
                </span>
              )
            )}
          </p>
        </div>
      </div>
      <div className="mt-3 bg-[#B0D2D2] rounded pb-4 pt-4 pl-6 sm:pl-2 ">
        <div className="font-bold mb-4">
          <h2 className="text-[20px] leading-[25px]">Stats</h2>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 ">
          {selectedPokemon?.stats?.map((item) => (
            <div key={item.idx} className="flex items-center justify-between">
              <label htmlFor="stat" className="text-sm w-[73px]">
                {toUpperCase(simplifyLabels(item.stat.name))}
              </label>
              <div className="relative w-[214px]">
                <span className="absolute left-1/2 top-0 -translate-x-1/2 font-bold text-[10px] text-white">
                  {item.base_stat}
                </span>

                <progress id="stat" value={item.base_stat} max="100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
