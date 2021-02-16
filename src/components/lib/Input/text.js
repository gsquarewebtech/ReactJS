import React from 'react'
import PropTypes from 'prop-types'

const Text = ({ type, value, placeholder, onChange }) => {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  )
}

Text.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

Text.defaultProps = {
  type: 'text',
  value: '',
  placeholder: ''
}

export default Text
