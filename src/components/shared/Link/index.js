import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Icon } from '@lib'

const CustomLink = ({ to, icon, iconAlign, tooltipId, tooltip, text, className, children, onClick, ...rest }) => {
  const handleClick = () => {
    onClick()
  }

  return (
    <Link
      className={className}
      to={to}
      onClick={handleClick}
      {...rest}
    >
      {icon && iconAlign === 'left' && (
        <Icon
          className={icon}
          tooltipId={tooltipId}
          tooltip={tooltip}
        />
      )}
      <span>
        {children || text }
      </span>
      {icon && iconAlign === 'right' && (
        <Icon
          className={icon}
          tooltipId={tooltipId}
          tooltip={tooltip}
        />
      )}
    </Link>
  )
}

CustomLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string,
  iconAlign: PropTypes.string,
  tooltipId: PropTypes.string,
  tooltip: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func
}

CustomLink.defaultProps = {
  iconAlign: 'left',
  onClick: () => {}
}

export default CustomLink
