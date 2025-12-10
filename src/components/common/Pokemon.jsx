import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchAllPokemons,
  fetchGenderData,
  fetchPokemonDetails,
  selectFilteredPokemons,
  selectLoading,
  setSelectedPokemon,
} from "../../store/pokemonSlice"
import Modal from "../modal/Modal"
import PokemonCard from "./PokemonCard"
import PokemonPreview from "./PokemonPreview"

export default function Pokemon() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pokemonsPerPage] = useState(18)
  const [pageLoading, setPageLoading] = useState(false)
  const [cachedPages, setCachedPages] = useState({})
  const modalRef = useRef(null)
  const dispatch = useDispatch()

  // Sync page from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const page = params.get('page')
    if (page && !isNaN(page)) {
      setCurrentPage(parseInt(page, 10))
    }
  }, [])

  // Update URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (currentPage > 1) {
      params.set("page", currentPage.toString())
    } else {
      params.delete("page")
    }
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname
    window.history.replaceState({}, "", newUrl)
  }, [currentPage])

  const filteredPokemons = useSelector(selectFilteredPokemons)
  const loading = useSelector(selectLoading)

  // Pagination logic
  const indexOfLastPokemon = currentPage * pokemonsPerPage
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage
  const currentPokemons =
    cachedPages[currentPage] ||
    filteredPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon)

  // Reset to page 1 when filters change and clear cache
  useEffect(() => {
    setCurrentPage(1)
    setCachedPages({})
  }, [filteredPokemons.length])

  // Cache current page
  useEffect(() => {
    if (!cachedPages[currentPage] && filteredPokemons.length > 0) {
      const pageData = filteredPokemons.slice(
        indexOfFirstPokemon,
        indexOfLastPokemon
      )
      setCachedPages((prev) => ({ ...prev, [currentPage]: pageData }))
    }
  }, [
    currentPage,
    filteredPokemons,
    indexOfFirstPokemon,
    indexOfLastPokemon,
    cachedPages,
  ])
  const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage)

  useEffect(() => {
    dispatch(fetchAllPokemons())
    dispatch(fetchGenderData())
  }, [])

  const handlePageChange = (newPage) => {
    setPageLoading(true)
    setTimeout(() => {
      setCurrentPage(newPage)
      setPageLoading(false)
    }, 300)
  }

  const showPokemonModal = (id, name = "bulbasaur") => {
    document.body.style.overflow = "hidden"
    dispatch(setSelectedPokemon(id))
    modalRef.current.showModal()
    dispatch(fetchPokemonDetails({ id, name }))
  }

  const closePokemonPreviewModal = () => {
    document.body.style.overflow = "unset"
    modalRef.current.close()
  }

  if (loading.pokemons) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Modal ref={modalRef}>
        <PokemonPreview close={closePokemonPreviewModal} />
      </Modal>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
          Showing {indexOfFirstPokemon + 1}-
          {Math.min(indexOfLastPokemon, filteredPokemons.length)} of{" "}
          {filteredPokemons.length} Pokémon
        </p>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm whitespace-nowrap">
            {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {pageLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <PokemonCard pokemons={currentPokemons} showModal={showPokemonModal} />
      )}
    </section>
  )
}
