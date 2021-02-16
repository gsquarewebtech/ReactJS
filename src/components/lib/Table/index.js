import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Table = ({ className, children }) => {
  return (
    <div className={classNames('table', className)}>
      {children}
    </div>
  )
}

Table.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

export default Table
