import React from 'react'
import classNames from 'classnames'
import { Icon } from '@lib'
import PropTypes from 'prop-types'

const Action = ({ className, children }) => {
  return (
    <div className={classNames('action-bar', className)}>
      {children}
    </div>
  )
}

const Search = ({ placeholder, value, onChange }) => {
  return (
    <div className='action-search'>
      <Icon className='fal fa-search' />
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(evt) => onChange(evt.target.value)}
      />
    </div>
  )
}

const Buttons = ({ children, className }) => {
  return (
    <div className={classNames('action-buttons', className)}>
      {children}
    </div>
  )
}

Action.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

Search.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
}

Search.defaultProps = {
  onChange: () => null
}

Buttons.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

export {
  Action,
  Search,
  Buttons
}
