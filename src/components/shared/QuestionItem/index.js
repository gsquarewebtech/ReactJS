import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Button, Icon } from '@lib'
import { Input, Submit } from '@shared/Form'
import { object, isPresent } from '@utils'
import ScoreInput from './score-input'

import updateQuestionnaireResponse from '@graphql/mutators/update-questionnaire-response'

// const questionTypes = {
//   1: 'open ended',
//   2: 'yes/no',
//   3: 'yes/no with explanation'
// }

const QuestionItem = ({
  id,
  question,
  response,
  readonly,
  onChangeAnswer,
  editScore
}) => {
  const responseAnswer = response.answer || ''
  const responseExplanation = response.explanation || ''

  const [answer, setAnswer] = useState(responseAnswer)
  const [score, setScore] = useState('')
  const [explanation, setExplanation] = useState(responseExplanation)
  const [skipped, setSkipped] = useState(response.skipped)
  const [answerChanged, setAnswerChanged] = useState(false)
  const [showSaveAnswer, setShowSaveAnswer] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [inputErrors, setInputErrors] = useState({})

  const handleSkip = (value) => {
    setSkipped(value)

    updateQuestionnaireResponse({
      id: response.id,
      skipped: value
    })

    if (value) {
      setAnswer('')
      setExplanation('')
      setShowSaveAnswer(false)
    }
  }

  const handleTextAnswerInputChange = (value) => {
    if (question.questionType === 1 && value !== answer) {
      setAnswerChanged(value !== answer)
      setShowSaveAnswer(value !== answer)

      if (value !== answer) {
        setAnswer(value)
      }
    }
  }

  const handleChangeYesNoAnswer = (value) => {
    if ([2, 3].includes(question.questionType)) {
      setAnswer(value)

      if (question.questionType === 2) {
        updateQuestionnaireResponse({
          id: response.id,
          answer: value
        })
      } else if (question.questionType === 3) {
        if (question.explainOn) {
          setShowExplanation(question.explainOn === value)
          setShowSaveAnswer(question.explainOn === value)

          if (question.explainOn !== value) {
            setExplanation('')
            updateQuestionnaireResponse({
              id: response.id,
              answer: value
            })
          }
        }
      }
    }
  }

  const handleExplanationChange = (value) => {
    setShowSaveAnswer(true)
    setAnswerChanged(true)
    setExplanation(value)
  }

  const handleSaveAnswer = () => {
    const feErrors = {}
    if (!answer) {
      feErrors.answer = [{ message: 'Answer is required' }]
    }

    if (showExplanation && !explanation) {
      feErrors.explanation = [{ message: 'Explanation is required' }]
    }

    if (!object.keys(feErrors).length) {
      const input = {
        id: response.id,
        answer
      }

      if (explanation) {
        input.explanation = explanation
      }

      updateQuestionnaireResponse(input).then(({ data }) => {
        if (data.updateQuestionnaireResponse) {
          setShowSaveAnswer(false)
        }
      })
    } else {
      setInputErrors(feErrors)
    }
  }

  const handleScoreInputChange = (value) => {
    setScore(value)
  }

  const handleUpdateScore = () => {
    if (isPresent(score)) {
      updateQuestionnaireResponse({
        id: response.id,
        score
      }).then(({ data }) => {
        if (data.updateQuestionnaireResponse) {
          setShowSaveAnswer(false)
        }
      })
    }
  }

  return (
    <div className='question-item'>
      {!question.isRequired && (
        <div className='question-item-header'>
          <div className='question-item-number'>
            Q# {question.questionNumber}
          </div>

          <div className='question-item-skipper'>
            <Input
              label='Skip'
              type='toggle'
              value={skipped}
              className='small'
              disabled={readonly}
              onChange={(value) => handleSkip(value)}
            />
          </div>
        </div>
      )}

      {question.isRequired && (
        <div className='question-item-header-required'>
          <div className='question-item-number'>
            Q# {question.questionNumber}
          </div>

          <Icon
            className='red-asterisk fal fa-asterisk'
          />
        </div>
      )}

      <div className='question-item-question'>
        {question.question}
      </div>

      {!skipped && (
        <div className='question-item-answer'>
          {question.questionType === 1 && (
            <Input
              label='Answer'
              type='textarea'
              value={answer}
              disabled={readonly}
              onChange={(value) => handleTextAnswerInputChange(value)}
              errors={inputErrors.answer}
            />
          )}

          {[2, 3].includes(question.questionType) && (
            <Input
              label='Answer'
              type='yes-no'
              value={answer}
              disabled={readonly}
              onChange={(value) => handleChangeYesNoAnswer(value)}
              errors={inputErrors.answer}
            />
          )}
        </div>
      )}

      {!skipped && (showExplanation || ((question.questionType === 3 && (question.explainOn === response.answer || !question.explainOn)))) && (
        <div className='question-item-explanation'>
          <Input
            label='Explanation'
            type='textarea'
            value={explanation}
            disabled={readonly}
            onChange={(value) => handleExplanationChange(value)}
            errors={inputErrors.explanation}
          />
        </div>
      )}

      {editScore && (
        <div className='question-item-edit-score'>
          <ScoreInput
            score={response.score}
            onChange={(value) => handleScoreInputChange(value)}
            onSave={handleUpdateScore}
          />
        </div>
      )}

      {!readonly && (showSaveAnswer && answerChanged) && (
        <div className='question-item-submit-answer'>
          <Submit className='right'>
            <Button
              className='circle'
              text='Save Answer'
              onClick={handleSaveAnswer}
            />
          </Submit>
        </div>
      )}
    </div>
  )
}

QuestionItem.propTypes = {
  id: PropTypes.string,
  question: PropTypes.object,
  response: PropTypes.object,
  readonly: PropTypes.bool,
  editScore: PropTypes.bool,
  onChangeAnswer: PropTypes.func
}

QuestionItem.defaultProps = {
  question: {},
  response: {},
  readonly: false,
  editScore: false,
  onChangeAnswer: () => {}
}

export default QuestionItem
