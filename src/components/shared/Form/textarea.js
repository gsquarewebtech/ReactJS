import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const TextareaInput = ({ state, value, placeholder, disabled, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value)

  const handleChange = (evt) => {
    if (!disabled) {
      const newValue = evt.target.value
      setCurrentValue(newValue)
      onChange(newValue)
    }
  }

  const inputValue = state ? currentValue : value

  return (
    <textarea
      value={inputValue}
      placeholder={placeholder}
      className={classNames({ disabled: disabled })}
      disabled={disabled}
      onChange={handleChange}
    />
  )
}

TextareaInput.propTypes = {
  state: PropTypes.bool,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
}

TextareaInput.defaultProps = {
  state: true,
  value: '',
  placeholder: '',
  disabled: false,
  onChange: (e) => {}
}

export default TextareaInput
