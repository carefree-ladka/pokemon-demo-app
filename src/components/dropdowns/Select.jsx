import React, { useEffect, useRef, useState } from "react"

const toUpperCase = (str) => {
  if (!str) {
    return ""
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export default function Select({
  placeholder = "Select Options",
  options = [],
  handleChange,
  isMultiColumn = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOptions = options.filter((option) => option.ischecked)
  const selectedCount = selectedOptions.length
  const firstSelected = selectedOptions[0]

  const displayText = () => {
    if (selectedCount === 0) {
      return "None selected"
    }
    if (selectedCount === 1) {
      return toUpperCase(firstSelected.value)
    }
    return `${toUpperCase(firstSelected.value)} +${selectedCount - 1} more`
  }

  const toggleDropdown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {placeholder}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={`
          w-full flex items-center justify-between px-4 py-3
          bg-gray-50 border border-gray-300 rounded-lg
          hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-all duration-200 min-h-[48px]
          ${isOpen ? "border-blue-500 ring-2 ring-blue-500" : ""}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm text-gray-700 truncate text-left">
          {displayText()}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto backdrop-blur-sm">
          <div
            className={`p-3 ${
              isMultiColumn ? "grid grid-cols-2 gap-2" : "space-y-2"
            }`}
            role="listbox"
          >
            {options.map((option) => (
              <label
                key={option.id || option.value}
                className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={option.ischecked || false}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleChange?.(e.target, option.type)
                  }}
                  value={option.value}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {toUpperCase(option.value)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
