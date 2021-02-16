import React from 'react'
import PropTypes from 'prop-types'

import logoImage from '@images/logo-white-icon-text.png'

const Logo = ({ height }) => {
  return (
    <div
      className='logo'
      style={{ height: height }}
    >
      <img src={logoImage} />
    </div>
  )
}

Logo.propTypes = {
  height: PropTypes.number.isRequired
}

export default Logo
