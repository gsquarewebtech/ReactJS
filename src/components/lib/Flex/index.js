import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Flex = ({ className, children }) => {
  return (
    <div className={classNames('flex', className)}>
      {children}
    </div>
  )
}

Flex.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

export default Flex
