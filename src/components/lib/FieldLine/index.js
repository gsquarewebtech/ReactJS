import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const FieldLine = ({ className, children }) => {
  return (
    <div className={classNames('field-line', className)}>
      {children}
    </div>
  )
}

FieldLine.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

export default FieldLine
