import React from 'react'
import PropTypes from 'prop-types'

import { Card } from '@lib'
import { Form, Group, Info } from '@shared/Form'
import { Table, Head, Body, Row, Column } from '@shared/Table'
import { toYesNo } from '@utils'

const QuestionnaireView = ({ questionnaire }) => {
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

      <h3>{`${questionnaire?.questions?.length} questions`}</h3>

      <Table>
        <Head>
          <Row>
            <Column
              className='centered'
              value='#'
            />
            <Column value='Question' />
            <Column
              className='centered'
              value='Question Type'
            />
            <Column
              className='centered'
              value='Yes Score'
            />
            <Column
              className='centered'
              value='No Score'
            />
            <Column
              className='centered'
              value='Disqualified On'
            />
            <Column value='Disqualified Answer' />
            <Column
              className='centered'
              value='Explain On'
            />
            <Column
              className='centered'
              value='Required'
            />
          </Row>
        </Head>

        <Body>
          {questionnaire.questions.map(question => (
            <Row key={question.id}>
              <Column
                className='centered'
                value={question.questionNumber}
              />
              <Column value={question.question} />
              <Column
                className='centered'
                value={question.questionType}
              />
              <Column
                className='centered'
                value={question.yesScore}
              />
              <Column
                className='centered'
                value={question.noScore}
              />
              <Column
                className='centered'
                value={toYesNo(question.disqualifiedOn)}
              />
              <Column value={question.disqualifiedAnswer} />
              <Column
                className='centered capitalize'
                value={question.explainOn}
              />
              <Column
                className='centered'
                value={toYesNo(question.isRequired)}
              />
            </Row>
          ))}
        </Body>
      </Table>
    </Card>
  )
}

QuestionnaireView.propTypes = {
  questionnaire: PropTypes.object
}

export default QuestionnaireView
