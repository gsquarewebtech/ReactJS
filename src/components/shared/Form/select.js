import React, { useState } from 'react'
import PropTypes from 'prop-types'

const SelectInput = ({ value, options, placeholder, disabled, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value)

  const handleChange = (evt) => {
    const newValue = evt.target.value
    setCurrentValue(newValue)
    onChange(newValue)
  }

  return (
    <select
      value={currentValue}
      onChange={handleChange}
      disabled={disabled}
    >
      {placeholder && (
        <option value=''>{placeholder}</option>
      )}
      {options.map((option, key) => (
        <option
          key={key}
          value={option.value}
        >
          {option.text}
        </option>
      ))}
    </select>
  )
}

SelectInput.propTypes = {
  value: PropTypes.any,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
}

SelectInput.defaultProps = {
  value: '',
  options: [],
  placeholder: '',
  disabled: false,
  onChange: (e) => {}
}

export default SelectInput
