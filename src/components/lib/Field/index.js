import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Field = ({ className, children }) => {
  return (
    <div className={classNames('field', className)}>
      {children}
    </div>
  )
}

Field.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

export default Field
