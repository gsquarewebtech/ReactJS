import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Column = ({ label, value, className, children }) => {
  return (
    <div className={classNames('column', className)}>
      { label && (<p className='label'>{label}</p>)}
      { label && value ? (<p className='value'>{value}</p>) : children }
    </div>
  )
}

Column.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  children: PropTypes.node
}

export default Column
