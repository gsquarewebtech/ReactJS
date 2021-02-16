import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Page = ({ name, className, children }) => {
  return (
    <div className={classNames('page', `${name}-page`, className)}>
      {children}
    </div>
  )
}

Page.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node
}

export default Page
