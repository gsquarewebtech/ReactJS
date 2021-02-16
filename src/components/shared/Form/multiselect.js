import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Icon, Button } from '@lib'
import ClickOutside from '@lib/ClickOutside'

const MultiSelectInput = ({ value, options, onChange }) => {
  const [collapsed, setColapsed] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)

  const selectedOptions = []
  const optionsWithState = options.map(option => {
    if (currentValue.includes(option.value)) {
      selectedOptions.push(option)
      option.selected = true
    } else {
      option.selected = false
    }

    return option
  })

  const handleToggleCollapse = () => {
    setColapsed(!collapsed)
  }

  const handleSelect = (option) => {
    const newState = [...currentValue]

    if (newState.includes(option.value)) {
      newState.splice(newState.indexOf(option.value), 1)
    } else {
      newState.push(option.value)
    }

    onChange(newState)
    setCurrentValue(newState)
  }

  const handleClickOutside = () => {
    if (collapsed) {
      setColapsed(false)
    }
  }

  return (
    <ClickOutside onClick={handleClickOutside}>
      <div className='multiselect-input'>
        <div
          className='multiselect-values'
          onClick={handleToggleCollapse}
        >
          <ul>
            {selectedOptions.map(option => (
              <li key={option.value}>
                <span className='text'>
                  {option.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {!!optionsWithState.length && (
          <div className={classNames('multiselect-options', { collapsed })}>
            <ul>
              {optionsWithState.map(option => (
                <li
                  key={option.value}
                  className={classNames({ selected: option.selected })}
                  onClick={() => handleSelect(option)}
                >
                  <Icon
                    className='icon fal fa-check-circle'
                  />
                  <span className='text'>
                    {option.text}
                  </span>
                </li>
              ))}
              <li>
                <Button
                  type='button'
                  className='small circle green'
                  text='Select'
                  onClick={handleClickOutside}
                />
              </li>
            </ul>
          </div>
        )}
      </div>
    </ClickOutside>

  )
}

MultiSelectInput.propTypes = {
  value: PropTypes.array,
  options: PropTypes.array,
  onChange: PropTypes.func
}

MultiSelectInput.defaultProps = {
  value: [],
  options: [],
  onChange: () => {}
}

export default MultiSelectInput
