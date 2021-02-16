import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Badge = ({ text, className, children }) => {
  return (
    <div className={classNames('badge', className)}>
      {text}
      {children}
    </div>
  )
}

Badge.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node
}

export default Badge
