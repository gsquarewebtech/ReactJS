import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const FieldAction = ({ className, children }) => {
  return (
    <div className={classNames('field-action', className)}>
      {children}
    </div>
  )
}

FieldAction.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

export default FieldAction
