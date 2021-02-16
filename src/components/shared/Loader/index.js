import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Loader = ({ className }) => {
  return (
    <div className={classNames('loader', className)}>
      <div className='cube-wrapper'>
        <div className='cube-folding'>
          <span className='leaf1'></span>
          <span className='leaf2'></span>
          <span className='leaf3'></span>
          <span className='leaf4'></span>
        </div>
        <span
          className='loading'
          data-name='Loading'
        >
          Loading
        </span>
      </div>
    </div>
  )
}

Loader.propTypes = {
  className: PropTypes.string
}

export default Loader
