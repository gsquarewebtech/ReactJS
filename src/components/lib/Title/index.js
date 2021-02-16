import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Title = ({ text, className, children }) => {
  return (
    <h1 className={classNames('title', className)}>
      {text}
      {children}
    </h1>
  )
}

Title.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node
}

export default Title
