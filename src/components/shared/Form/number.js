import React, { useState } from 'react'
import PropTypes from 'prop-types'

const NumberInput = ({ state, value, placeholder, disabled, settings, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value)

  const handleChange = (evt) => {
    const regexStr = settings.float ? '^[0-9]*$|^[.][0-9]*$|^[0-9]*[.]$|^[0-9]*[.][0-9]*$' : '^[0-9]*$'
    const regex = new RegExp(regexStr)

    const newValue = evt.target.value

    if (regex.test(newValue) && !disabled) {
      onChange(newValue)
      setCurrentValue(newValue)
    } else if (!newValue) {
      onChange('')
      setCurrentValue('')
    }
  }

  const inputValue = state ? currentValue : value

  return (
    <input
      type='text'
      value={inputValue}
      placeholder={placeholder}
      onChange={handleChange}
    />
  )
}

NumberInput.propTypes = {
  state: PropTypes.bool,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  settings: PropTypes.object,
  onChange: PropTypes.func
}

NumberInput.defaultProps = {
  state: true,
  value: '',
  placeholder: '',
  disabled: false,
  settings: {},
  onChange: (e) => {}
}

export default NumberInput
