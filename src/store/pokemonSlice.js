import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getAllPokemons,
  getGenderData,
  getPokemonDescription,
  getPokemonDisabilities,
  getPokemonGender,
} from "../services/pokemonService"

// Async thunks
export const fetchAllPokemons = createAsyncThunk(
  "pokemon/fetchAllPokemons",
  async () => getAllPokemons()
)

export const fetchPokemonDetails = createAsyncThunk(
  "pokemon/fetchPokemonDetails",
  async ({ id, name }) => {
    const [gender, disabilities, description] = await Promise.all([
      getPokemonGender(name),
      getPokemonDisabilities(id),
      getPokemonDescription(id),
    ])
    return { gender, disabilities, description }
  }
)

export const fetchGenderData = createAsyncThunk(
  "pokemon/fetchGenderData",
  async () => getGenderData()
)

const initialState = {
  allPokemons: [],
  genderData: [],
  selectedPokemon: null,
  pokemonDetails: {
    gender: null,
    disabilities: null,
    description: null,
  },
  filters: {
    search: "",
    types: [],
    genders: [],
  },
  loading: {
    pokemons: false,
    details: false,
    genderData: false,
  },
}

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    setSelectedPokemon: (state, { payload }) => {
      state.selectedPokemon = state.allPokemons.find(
        (pokemon) => pokemon.id === payload
      ) || null
    },
    setSearchFilter: (state, { payload }) => {
      state.filters.search = payload
    },
    setTypeFilters: (state, { payload }) => {
      state.filters.types = payload
    },
    setGenderFilters: (state, { payload }) => {
      state.filters.genders = payload
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all pokemons
      .addCase(fetchAllPokemons.pending, (state) => {
        state.loading.pokemons = true
      })
      .addCase(fetchAllPokemons.fulfilled, (state, { payload }) => {
        state.allPokemons = payload
        state.loading.pokemons = false
      })
      .addCase(fetchAllPokemons.rejected, (state) => {
        state.loading.pokemons = false
      })
      // Fetch pokemon details
      .addCase(fetchPokemonDetails.pending, (state) => {
        state.loading.details = true
      })
      .addCase(fetchPokemonDetails.fulfilled, (state, { payload }) => {
        state.pokemonDetails = payload
        state.loading.details = false
      })
      .addCase(fetchPokemonDetails.rejected, (state) => {
        state.loading.details = false
      })
      // Fetch gender data
      .addCase(fetchGenderData.pending, (state) => {
        state.loading.genderData = true
      })
      .addCase(fetchGenderData.fulfilled, (state, { payload }) => {
        state.genderData = payload
        state.loading.genderData = false
      })
      .addCase(fetchGenderData.rejected, (state) => {
        state.loading.genderData = false
      })
  },
})

export const {
  setSelectedPokemon,
  setSearchFilter,
  setTypeFilters,
  setGenderFilters,
  clearFilters,
} = pokemonSlice.actions

// Selectors
export const selectAllPokemons = (state) => state.pokemon.allPokemons
export const selectGenderData = (state) => state.pokemon.genderData
export const selectSelectedPokemon = (state) => state.pokemon.selectedPokemon
export const selectPokemonDetails = (state) => state.pokemon.pokemonDetails
export const selectFilters = (state) => state.pokemon.filters
export const selectLoading = (state) => state.pokemon.loading

// Computed selectors
export const selectFilteredPokemons = (state) => {
  const { allPokemons = [], genderData = [], filters = {} } = state.pokemon
  let filtered = [...allPokemons]

  // Apply search filter
  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase().trim()
    filtered = filtered.filter(
      (pokemon) =>
        pokemon?.id?.toString().includes(searchTerm) ||
        pokemon?.name?.toLowerCase().includes(searchTerm) ||
        pokemon?.name?.toLowerCase().startsWith(searchTerm)
    )
  }

  // Apply type filters
  if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter((pokemon) => {
      return pokemon?.types?.some((typeInfo) => 
        filters.types.includes(typeInfo?.type?.name)
      )
    })
  }

  // Apply gender filters
  if (filters.genders && filters.genders.length > 0) {
    filtered = filtered.filter((pokemon) => {
      // Simple gender mapping based on Pokemon ID ranges (demo purposes)
      const pokemonGender = pokemon.id % 3 === 0 ? 'genderless' : pokemon.id % 2 === 0 ? 'female' : 'male'
      return filters.genders.includes(pokemonGender)
    })
  }

  return filtered
}

export default pokemonSlice.reducer
