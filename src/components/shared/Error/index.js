import React from 'react'
import PropTypes from 'prop-types'
import { array, object } from '@utils'

const Error = ({ error }) => {
  if (!error.message) {
    return null
  }

  return (
    <div className='error'>
      {error.message}
    </div>
  )
}

const Errors = ({ errors }) => {
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
      <div className='errors'>
        {errorList.map((error, index) => (
          <Error
            key={index}
            error={error}
          />
        ))}
      </div>
    )
  }

  return null
}

Error.propTypes = {
  error: PropTypes.object
}

Errors.propTypes = {
  errors: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ])
}

export {
  Error,
  Errors
}
