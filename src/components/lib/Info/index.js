import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Info = ({ className, children }) => {
  return (
    <div className={classNames('info', className)}>
      {children}
    </div>
  )
}

Info.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

export default Info
