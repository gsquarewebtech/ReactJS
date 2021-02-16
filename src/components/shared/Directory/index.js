import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Directory = ({ link, text }) => {
  return (
    <Link
      className='directory-link'
      to={link}
    >
      <div className='directory'>
        <div className='bullet'></div>
        {text}
      </div>
    </Link>
  )
}

Directory.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

export default Directory
