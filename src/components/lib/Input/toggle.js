import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Toggle = ({ checked, onChange }) => {
  return (
    <div
      className={classNames('toggle', { checked: checked })}
      onClick={onChange}
    >
      <div className='knobs' />
    </div>
  )
}

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func
}

export default Toggle
