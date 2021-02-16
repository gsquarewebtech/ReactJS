import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Loaders, Icon } from '@lib'

const Button = ({ type, text, icon, iconAlign, className, children, onClick, loading, ...rest }) => {
  const handleClick = () => {
    if (!loading) {
      onClick()
    }
  }

  if (loading) {
    return (
      <button
        className={classNames('button', className)}
        {...rest}
      >
        <Loaders.LoaderA />
      </button>
    )
  }

  return (
    <button
      className={classNames('button', className)}
      onClick={handleClick}
      type={type}
      {...rest}
    >
      {icon && iconAlign === 'left' && (
        <Icon
          className={classNames('icon', icon)}
        />
      )}
      {text && (<span>{text}</span>)}
      {icon && iconAlign === 'right' && (
        <Icon
          className={icon}
        />
      )}
      {children}
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
  icon: PropTypes.string,
  iconAlign: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  loading: PropTypes.bool
}

Button.defaultProps = {
  type: 'button',
  iconAlign: 'left',
  onClick: () => {}
}

export default Button
