import React, { useState } from 'react'
import PropTypes from 'prop-types'

const TextInput = ({ state, value, placeholder, disabled, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value)

  const handleChange = (evt) => {
    if (!disabled) {
      const newValue = evt.target.value
      onChange(newValue)

      if (state) {
        setCurrentValue(newValue)
      }
    }
  }

  const inputValue = state ? currentValue : value

  return (
    <input
      type='text'
      value={inputValue}
      placeholder={placeholder}
      disabled={disabled}
      onChange={handleChange}
    />
  )
}

TextInput.propTypes = {
  state: PropTypes.bool,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
}

TextInput.defaultProps = {
  state: true,
  value: '',
  placeholder: '',
  disabled: false,
  onChange: (e) => {}
}

export default TextInput
