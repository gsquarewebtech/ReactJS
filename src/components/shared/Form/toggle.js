import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const ToggleInput = ({ value, disabled, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value)

  const handleChange = (evt) => {
    if (!disabled) {
      const newValue = !currentValue
      setCurrentValue(newValue)
      onChange(newValue)
    }
  }

  return (
    <div
      className={classNames('toggle-input', { active: currentValue === true })}
      value={currentValue}
      onClick={handleChange}
    >
      <div className='toggle-inner'>
        <div className='toggler'></div>
      </div>
    </div>
  )
}

ToggleInput.propTypes = {
  value: PropTypes.any,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
}

ToggleInput.defaultProps = {
  value: false,
  disabled: false,
  onChange: (e) => {}
}

export default ToggleInput
