import React, { useState } from 'react'
import PropTypes from 'prop-types'

const PasswordInput = ({ value, placeholder, autoComplete, disabled, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value)

  const handleChange = (evt) => {
    if (!disabled) {
      const newValue = evt.target.value
      setCurrentValue(newValue)
      onChange(newValue)
    }
  }

  return (
    <input
      type='password'
      value={currentValue}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      onChange={handleChange}
    />
  )
}

PasswordInput.propTypes = {
  value: PropTypes.any,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
}

PasswordInput.defaultProps = {
  value: '',
  placeholder: '',
  autoComplete: 'off',
  disabled: false,
  onChange: (e) => {}
}

export default PasswordInput
