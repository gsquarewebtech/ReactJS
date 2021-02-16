import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Icon } from '@lib'
import Flatpickr from 'react-flatpickr'

import Text from './text'
import Select from './select'
import TextArea from './text-area'
import Toggle from './toggle'

const Input = ({ type, options, value, checked, placeholder, icon, onChange, className, onEnterKey, errors }) => {
  let inputType = null
  const wrapperClass = []

  if (['text', 'password', 'number'].includes(type)) {
    inputType = (
      <Text
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onEnterKey={onEnterKey}
      />
    )
  } else if (type === 'textarea') {
    wrapperClass.push('textarea')
    inputType = (
      <TextArea
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    )
  } else if (type === 'select') {
    inputType = (
      <Select
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={onChange}
      />
    )
  } else if (type === 'toggle') {
    inputType = (
      <Toggle
        checked={checked}
        onChange={onChange}
      />
    )
  } else if (type === 'date') {
    inputType = (
      <Flatpickr
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    )
  }

  return (
    <div className={classNames('input-block', className, { 'has-error': errors })}>
      <div className={classNames('input', wrapperClass)}>
        {icon && (
          <div className='icon'>
            <Icon className={icon} />
          </div>
        )}
        {inputType}
      </div>
    </div>
  )
}

Input.propTypes = {
  type: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.any,
  checked: PropTypes.bool,
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  onEnterKey: PropTypes.func,
  errors: PropTypes.array
}

Input.defaultProps = {
  type: 'text',
  options: [],
  value: '',
  checked: false
}

export default Input
