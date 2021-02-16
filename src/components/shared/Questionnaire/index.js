import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Form, Input } from '@shared/Form'

const Question = ({ question }) => {
  const [answer, setAnswer] = useState('')

  const handleAnswerChange = (value) => {
    if ([2, 3].includes(question.questionType)) {
      setAnswer(value)
    }
  }

  return (
    <div className='question-view'>
      <div className='question-number'>
        <span>
          {`#${question.questionNumber}`}
        </span>
      </div>
      <div className='question-question'>
        {question.question}
      </div>

      {question.questionType === 1 && (
        <Form className='no-margin'>
          <Input
            label='Answer'
            type='textarea'
          />
        </Form>
      )}

      {[2, 3].includes(question.questionType) && (
        <div className='question-input'>
          <div className='question-label'>
            Answer
          </div>
          <div className='question-answer'>
            <div
              className={classNames('answer-yes', { active: answer === 'yes' })}
              onClick={() => handleAnswerChange('yes')}
            >
              Yes
            </div>
            <div
              className={classNames('answer-no', { active: answer === 'no' })}
              onClick={() => handleAnswerChange('no')}
            >
              No
            </div>
          </div>
        </div>
      )}

      {question.questionType === 3 && question.explainOn === answer && (
        <Form className='no-margin'>
          <Input
            label='Explanation'
            type='textarea'
          />
        </Form>
      )}
    </div>
  )
}

Question.propTypes = {
  question: PropTypes.object
}

export {
  Question
}
