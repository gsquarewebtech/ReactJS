import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Flatpickr from 'react-flatpickr'

import TextInput from './text'
import NumberInput from './number'
import PasswordInput from './password'
import TextareaInput from './textarea'
import SelectInput from './select'
import MultiSelectInput from './multiselect'
import FileInput from './file'
import DatepickerInput from './datepicker'
import ToggleInput from './toggle'
import YesOrNoInput from './yes-or-no'

import { Icon } from '@lib'
import { string, array, object } from '@utils'

const Form = ({ className, children, onSubmit }) => {
  return (
    <form
      className={classNames('form', className)}
      onSubmit={onSubmit}
      noValidate
    >
      {children}
    </form>
  )
}

const Group = ({ className, children }) => {
  return (
    <div className={classNames('form-group', className)}>
      {children}
    </div>
  )
}

const Input = ({
  state,
  label,
  icon,
  type,
  placeholder,
  autoComplete,
  value,
  disabled,
  options,
  settings,
  onChange,
  errors,
  className
}) => {
  let formInput = null

  if (!value) {
    value = ''
  }

  if (type === 'text') {
    formInput = (
      <TextInput
        state={state}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
      />
    )
  } else if (type === 'password') {
    formInput = (
      <PasswordInput
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        onChange={onChange}
      />
    )
  } else if (type === 'number') {
    formInput = (
      <NumberInput
        state={state}
        value={value}
        placeholder={placeholder}
        settings={settings}
        disabled={disabled}
        onChange={onChange}
      />
    )
  } else if (type === 'select') {
    formInput = (
      <SelectInput
        value={value}
        options={options}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
      />
    )
  } else if (type === 'multiselect') {
    formInput = (
      <MultiSelectInput
        value={value || []}
        options={options}
        placeholder={placeholder}
        onChange={onChange}
      />
    )
  } else if (type === 'textarea') {
    formInput = (
      <TextareaInput
        state={state}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
      />
    )
  } else if (type === 'file') {
    formInput = (
      <FileInput
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
      />
    )
  } else if (type === 'toggle') {
    formInput = (
      <ToggleInput
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    )
  } else if (type === 'yes-no') {
    formInput = (
      <YesOrNoInput
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    )
  } else if (type === 'datepicker') {
    formInput = (
      <DatepickerInput
        value={value}
        placeholder={placeholder}
        settings={settings}
        disabled={disabled}
        onChange={onChange}
      />
    )
  } else if (type === 'datetime') {
    formInput = (
      <div className={classNames('input', 'datetime', className)}>
        <Flatpickr
          data-enable-time
          options={settings}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    )
  }

  return (
    <div className='form-input'>
      {label && (
        <div className='input-label'>
          {label}
        </div>
      )}

      <div className={classNames('input', type, className, { 'has-error': !!errors.length, disabled: disabled })}>
        {icon && (
          <Icon
            className={icon}
          />
        )}
        {formInput}
      </div>
    </div>
  )
}

const Info = ({ label, value }) => {
  return (
    <div className='form-info'>
      <div className='input-label'>
        {label}
      </div>
      <div className='form-info-value'>
        {value}
      </div>
    </div>
  )
}

const Submit = ({ className, children }) => {
  return (
    <div className={classNames('form-submit', className)}>
      {children}
    </div>
  )
}

const FormError = ({ errors }) => {
  if (!errors) {
    return null
  }

  let errorList = []

  if (array.isArray(errors)) {
    errorList = errors
  } else if (object.isObject(errors)) {
    object.keys(errors).forEach(key => {
      errorList = errorList.concat(errors[key])
    })
  }

  if (errorList.length) {
    return (
      <div className='form-errors'>
        {errorList.map((error, index) => (
          <div
            key={index}
            className='form-error'
          >
            {string.properCase(error.message)}
          </div>
        ))}
      </div>
    )
  }

  return null
}

const FormMessage = ({ message, className }) => {
  if (message) {
    return (
      <div className={classNames('form-message', className)}>
        {message}
      </div>
    )
  }

  return null
}

Form.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onSubmit: PropTypes.func
}

Form.defaultProps = {
  onSubmit: () => {}
}

Group.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

Input.propTypes = {
  state: PropTypes.bool,
  label: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.array,
  value: PropTypes.any,
  settings: PropTypes.object,
  onChange: PropTypes.func,
  errors: PropTypes.array,
  className: PropTypes.string
}

Input.defaultProps = {
  state: true,
  placeholder: '',
  settings: {},
  autoComplete: 'off',
  disabled: false,
  errors: [],
  onChange: () => {}
}

Info.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any
}

Submit.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

FormError.propTypes = {
  errors: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ])
}

FormMessage.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string
}

FormError.defaultProps = {
  errors: null
}

export {
  Form,
  Group,
  Input,
  Info,
  Submit,
  FormError,
  FormMessage
}
