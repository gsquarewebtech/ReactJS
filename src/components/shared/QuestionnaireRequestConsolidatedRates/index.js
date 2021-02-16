import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import { Card } from '@lib'
import { Table, Head, Body, Row, Column } from '@shared/Table'
import { time } from '@utils'

import questionnaireRequestConsolidatedRatesGql from '@graphql/queries/questionnaire-request-consolidated-rates'

const QuestionnaireRequestConsolidatedRates = ({ questionnaireRequestGroupId }) => {
  const ratesQuery = useQuery(questionnaireRequestConsolidatedRatesGql, {
    variables: {
      questionnaireRequestGroupId
    }
  })

  if (ratesQuery.loading) {
    return null
  }

  const rates = ratesQuery.data.questionnaireRequestConsolidatedRates

  return (
    <Card>
      <Table>
        <Head>
          <Row>
            <Column value='RATE_CODE' />
            <Column value='RATE_DESCRIPTION' />
            <Column value='MAIL_ORDER_IND' />
            <Column value='GENERIC_IND' />
            <Column value='SPECIALTY_IND' />
            <Column value='DAYS_SUPPLY_GROUP' />
            <Column value='DISCOUNT' />
            <Column value='DISPENSING_FEE' />
            <Column value='ADMIN_FEE' />
            <Column value='REBATE' />
            <Column value='BEGIN_DT' />
            <Column value='END_DT' />
          </Row>
        </Head>
        <Body>
          {rates.map(rate => (
            <Row key={rate.id}>
              <Column value={rate.rateCode} />
              <Column value={rate.rateDescription} />
              <Column value={rate.mailOrderInd} />
              <Column value={rate.genericInd} />
              <Column value={rate.specialtyInd} />
              <Column value={rate.daysSupplyGroup} />
              <Column value={rate.discount} />
              <Column value={rate.dispensingFee} />
              <Column value={rate.adminFee} />
              <Column value={rate.rebate} />
              <Column value={time.utc(rate.beginDate).local().format('YYYY-MM-DD')} />
              <Column value={time.utc(rate.endDate).local().format('YYYY-MM-DD')} />
            </Row>
          ))}
        </Body>
      </Table>
    </Card>
  )
}

QuestionnaireRequestConsolidatedRates.propTypes = {
  questionnaireRequestGroupId: PropTypes.string.isRequired
}

export default QuestionnaireRequestConsolidatedRates
