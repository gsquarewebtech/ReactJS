import React, { useState } from 'react'
import PropTypes from 'prop-types'

const FileInput = ({ value, placeholder, disabled, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value)

  const handleChange = (evt) => {
    if (evt.target.files.length === 1) {
      const file = evt.target.files[0]
      setCurrentValue(file)
      onChange(file)
    }
  }

  return (
    <div className='file-input'>
      <span className='file-name'>
        {currentValue?.name || placeholder}
      </span>
      <input
        type='file'
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleChange}
      />
    </div>
  )
}

FileInput.propTypes = {
  value: PropTypes.any,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
}

FileInput.defaultProps = {
  value: '',
  placeholder: '',
  disabled: false,
  onChange: (e) => {}
}

export default FileInput
