import React from 'react'
import PropTypes from 'prop-types'

const TextArea = ({ value, placeholder, onChange }) => {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  )
}

TextArea.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
}

export default TextArea
