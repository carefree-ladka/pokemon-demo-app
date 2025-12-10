import React from "react"
import Select from "./Select"

export default function TypeFilter({ options, handleChange }) {
  return (
    <Select
      placeholder="Type"
      options={options}
      handleChange={(target, type) => handleChange(target, "types")}
      isMultiColumn={true}
    />
  )
}
