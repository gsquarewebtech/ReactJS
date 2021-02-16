import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const YesOrNoInput = ({ value, disabled, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value)

  const handleChange = (value) => {
    if (!disabled) {
      setCurrentValue(value)
      onChange(value)
    }
  }

  return (
    <div
      className='yes-no-input'
      value={currentValue}
    >
      <div
        className={classNames('answer-input', { active: currentValue === 'yes' })}
        onClick={() => handleChange('yes')}
      >
        Yes
      </div>
      <div
        className={classNames('answer-input', { active: currentValue === 'no' })}
        onClick={() => handleChange('no')}
      >
        No
      </div>
    </div>
  )
}

YesOrNoInput.propTypes = {
  value: PropTypes.any,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
}

YesOrNoInput.defaultProps = {
  value: '',
  disabled: false,
  onChange: (e) => {}
}

export default YesOrNoInput
