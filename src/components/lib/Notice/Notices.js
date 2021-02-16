import React from 'react'
import PropTypes from 'prop-types'

const Notices = ({ children }) => {
  return (
    <div className='notices'>
      {children}
    </div>
  )
}

Notices.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

export default Notices
