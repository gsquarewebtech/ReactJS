import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import defaultAvatar from '@images/avatar-default.jpg'

const Avatar = ({ url, className }) => {
  return (
    <div className={classNames('avatar', className)}>
      <img src={url || defaultAvatar} />
    </div>
  )
}

Avatar.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string
}

export default Avatar
