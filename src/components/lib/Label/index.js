import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Label = ({ text, className, children }) => {
  return (
    <div className={classNames('label', className)}>
      {text}
      {children}
    </div>
  )
}

Label.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node
}

export default Label
