import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Notice = ({ message, className }) => {
  return (
    <div className={classNames('notice', className)}>
      {message}
    </div>
  )
}

Notice.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string
}

export default Notice
