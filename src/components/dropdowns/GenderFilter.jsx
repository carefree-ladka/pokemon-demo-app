import React from "react"
import Select from "./Select"

export default function GenderFilter({ options, handleChange }) {
  return (
    <Select
      placeholder="Gender"
      options={options}
      handleChange={(target, type) => handleChange(target, "gender")}
    />
  )
}
