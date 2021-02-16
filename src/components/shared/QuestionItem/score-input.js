import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { isPresent } from '@utils'

const ScoreInput = ({ score, onChange, onSave }) => {
  const [currentValue, setValue] = useState(score)
  const [scoreChanged, setScoreChanged] = useState(false)

  const handleChange = (evt) => {
    const regex = new RegExp('^[0-9]*$')
    const value = evt.target.value
    if (regex.test(value)) {
      setScoreChanged(true)
      setValue(value)
      onChange(parseInt(value))
    }
  }

  const handleSave = () => {
    if (isPresent(currentValue)) {
      setScoreChanged(false)
      onSave()
    }
  }

  return (
    <div className='score-input-form'>
      <label>Score</label>
      <div className='score-input'>
        <input
          type='text'
          value={currentValue || ''}
          onChange={handleChange}
        />
        {scoreChanged && (
          <button onClick={handleSave}>
            Update
          </button>
        )}
      </div>
    </div>
  )
}

ScoreInput.propTypes = {
  score: PropTypes.number,
  onChange: PropTypes.func,
  onSave: PropTypes.func
}

ScoreInput.defaultProps = {
  score: '',
  onChange: () => null,
  onSave: () => null
}

export default ScoreInput
