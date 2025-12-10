import { useState } from 'react'
import Pokemon from './components/common/Pokemon'
import Home from './components/home/Home'
import { gender as filterGenders, types as filterTypes } from './utils/types'

function App() {
  const [typeOptions] = useState(filterTypes)
  const [genderOptions] = useState(filterGenders)

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Pokédex</h1>
            <p className="text-lg text-gray-600">Discover and explore the world of Pokémon</p>
          </header>

          <Home
            typeOptions={typeOptions}
            genderOptions={genderOptions}
          />
          <Pokemon />
        </div>
      </main>
    </div>
  )
}

export default App
