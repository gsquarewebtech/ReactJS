import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Card, Pagination } from '@lib'
import { Form, Group, Info } from '@shared/Form'
// import { Action, Buttons } from '@shared/Action'
import { Question } from '@shared/Questionnaire'

const QuestionnairePreview = ({ questionnaire }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showedQuestionCount, setShowedQuestionCount] = useState(5)

  const questionsLength = questionnaire.questions.length
  const pages = Math.ceil(questionsLength / showedQuestionCount)

  const currentQuestions = []
  const startQuestionIndex = (currentPage - 1) * showedQuestionCount
  let endQuestionIndex = startQuestionIndex + (showedQuestionCount - 1)
  if (endQuestionIndex > (questionsLength - 1)) {
    endQuestionIndex = questionsLength - 1
  }

  for (let i = startQuestionIndex; i <= endQuestionIndex; i++) {
    const question = questionnaire.questions[i]
    currentQuestions.push(
      <Question
        key={question.id}
        question={question}
      />
    )
  }

  const handlePageClick = (page) => {
    setCurrentPage(page)
  }

  const handlePaginationSizeChange = (size) => {
    setCurrentPage(1)
    setShowedQuestionCount(size)
  }

  return (
    <Card>
      <Form>
        <Group>
          <Info
            label='Name'
            value={questionnaire.name}
          />
        </Group>
        <Group>
          <Info
            label='Description'
            value={questionnaire.description}
          />
        </Group>
      </Form>

      <h3>{`${questionnaire.questions.length} questions`}</h3>

      {currentQuestions}

      <Pagination
        className='centered'
        pages={pages}
        limit={10}
        currentPage={currentPage}
        onPageClick={handlePageClick}
        sizes={[5, 10, 25, 50, 100]}
        selectedSize={showedQuestionCount}
        onSizeChange={handlePaginationSizeChange}
      />
    </Card>
  )
}

QuestionnairePreview.propTypes = {
  questionnaire: PropTypes.object
}

QuestionnairePreview.defaultProps = {
  questionnaire: {
    questions: []
  }
}

export default QuestionnairePreview
