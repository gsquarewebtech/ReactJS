import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const ListView = ({ className, children }) => {
  return (
    <div className={classNames('list-view', className)}>
      {children}
    </div>
  )
}

const Item = ({ className, children }) => {
  return (
    <div className={classNames('item', className)}>
      {children}
    </div>
  )
}

const Field = ({ label, value, noLabel, children, className }) => {
  return (
    <div className={classNames('item-field', className)}>
      {!noLabel && (
        <div className='field-label'>
          {label}
        </div>
      )}

      <div className='field-data'>
        {children || value}
      </div>
    </div>
  )
}

ListView.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

Item.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

Field.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  noLabel: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string
}

export {
  ListView,
  Item,
  Field
}
