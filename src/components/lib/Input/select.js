import React from 'react'
import PropTypes from 'prop-types'

const Select = ({ placeholder, options, value, onChange }) => {
  const optionsData = options.map((option, index) => {
    if (option.constructor === Object) {
      return (
        <option
          key={index}
          value={option.value}
        >
          {option.text}
        </option>
      )
    } else {
      return (
        <option
          key={index}
          value={option}
        >
          {option}
        </option>
      )
    }
  })

  return (
    <select
      onChange={onChange}
      value={value}
    >
      {placeholder && (
        <option value=''>{placeholder}</option>
      )}
      {options && optionsData}
    </select>
  )
}

Select.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func
}

export default Select
