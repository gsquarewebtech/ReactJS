import React from 'react'
import PropTypes from 'prop-types'

import { Icon } from '@lib'
import { Input } from '@shared/Form'
import { toBoolean, getQuestionType } from '@utils'

const QuestionnairePreviewExcel = ({ table }) => {
  return (
    <div>
      {table.rows.map((question, index) => (
        <div
          className='question-item'
          key={`question-${index}`}
        >
          {toBoolean(question.required) && (
            <div className='question-item-header-required'>
              <div className='question-item-number'>
                Q# {question['question #']}
              </div>
              <Icon
                className='red-asterisk fal fa-asterisk'
              />
            </div>
          )}

          {!toBoolean(question.required) && (
            <div className='question-item-header'>
              <div className='question-item-number'>
                Q# {question['question #']}
              </div>
              <div className='question-item-skipper'>
                <Input
                  label='Skip'
                  type='toggle'
                  className='small'
                  disabled={true}
                />
              </div>
            </div>
          )}

          <div className='question-item-question'>
            {question.question}
          </div>

          <div className='question-item-answer'>
            {getQuestionType(question.question_type) === 1 && (
              <Input
                label='Answer'
                type='textarea'
                disabled={true}
              />
            )}

            {[2, 3].includes(getQuestionType(question.question_type)) && (
              <Input
                label='Answer'
                type='yes-no'
                disabled={true}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

QuestionnairePreviewExcel.propTypes = {
  table: PropTypes.object
}

QuestionnairePreviewExcel.defaultProps = {
  table: {
    headers: [],
    rows: []
  }
}

export default QuestionnairePreviewExcel
