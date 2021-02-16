import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Flatpickr from 'react-flatpickr'
import { array } from '@utils'

const Datepicker = ({ value, placeholder, settings, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value)

  const handleChange = (value) => {
    let newValue = null

    if (array.isArray(value) && value.length === 1) {
      newValue = value[0]
    }

    setCurrentValue(newValue)
    onChange(newValue)
  }

  return (
    <Flatpickr
      value={currentValue}
      options={settings}
      onChange={handleChange}
      placeholder={placeholder}
    />
  )
}

Datepicker.propTypes = {
  value: PropTypes.any,
  placeholder: PropTypes.string,
  settings: PropTypes.object,
  onChange: PropTypes.func
}

Datepicker.defaultProps = {
  value: '',
  placeholder: '',
  settings: {},
  onChange: () => {}
}

export default Datepicker
