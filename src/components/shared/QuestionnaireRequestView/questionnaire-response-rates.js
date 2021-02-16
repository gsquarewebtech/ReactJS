import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { object, time } from '@utils'
import { Group, Input } from '@shared/Form'

import updateQuestionnaireResponseRate from '@graphql/mutators/update-questionnaire-response-rate'

const getRateWithDate = (rates) => {
  let rate = {}

  for (let i = 0; i < rates.length; i++) {
    if (rates[i].beginDate) {
      rate = rates[i]
      break
    }
  }

  return rate
}

const QuestionnaireResponseRate = ({ dates, rate, readonly }) => {
  const [showSave, setShowSave] = useState(false)
  const [input, setInput] = useState({
    discount: rate.discount,
    dispensingFee: rate.dispensingFee,
    adminFee: rate.adminFee,
    rebate: rate.rebate
  })
  const [errors, setErrors] = useState({})

  const handleNumberInputChange = (name, value) => {
    if (readonly) {
      return
    }

    const regexStr = '^[0-9]*$|^[.][0-9]*$|^[0-9]*[.]$|^[0-9]*[.][0-9]*$'
    const regex = new RegExp(regexStr)

    if (regex.test(value)) {
      const newInput = { ...input }
      newInput[name] = value
      setInput(newInput)
      setShowSave(true)
    }
  }

  const handleSave = () => {
    const feErrors = {}

    if (!input.discount) {
      feErrors.discount = [{ message: 'discount is required' }]
    }

    if (!input.dispensingFee) {
      feErrors.dispensingFee = [{ message: 'dispensing fee is required' }]
    }

    if (!input.adminFee) {
      feErrors.adminFee = [{ message: 'admin fee is required' }]
    }

    if (!input.rebate) {
      feErrors.rebate = [{ message: 'rebate is required' }]
    }

    if (!dates.start) {
      feErrors.beginDate = [{ message: 'begin date is required' }]
    }

    if (!dates.end) {
      feErrors.endDate = [{ message: 'end date is required' }]
    }

    if (!object.keys(feErrors).length) {
      updateQuestionnaireResponseRate({
        id: rate.id,
        discount: parseInt(input.discount),
        dispensingFee: parseFloat(input.dispensingFee),
        adminFee: parseFloat(input.adminFee),
        rebate: parseFloat(input.rebate),
        beginDate: time.utc(dates.start).format(),
        endDate: time.utc(dates.end).format()
      }).then(({ data }) => {
        setErrors({})
        setShowSave(false)
      })
    } else {
      setErrors(feErrors)
    }
  }

  return (
    <tr key={rate.id}>
      <td>
        {rate.mailOrderInd}
      </td>

      <td>
        {rate.genericInd}
      </td>

      <td>
        {rate.specialtyInd}
      </td>

      <td className='center'>
        {rate.daysSupplyGroup}
      </td>

      <td className='input center discount'>
        <Input
          type='number'
          value={input.discount}
          onChange={(value) => handleNumberInputChange('discount', value)}
          disabled={readonly}
          errors={errors.discount}
        />
        <span className='symbol'>
          %
        </span>
      </td>

      <td className='input center'>
        <Input
          type='number'
          settings={{ float: true }}
          value={input.dispensingFee}
          onChange={(value) => handleNumberInputChange('dispensingFee', value)}
          disabled={readonly}
          errors={errors.dispensingFee}
        />
      </td>

      <td className='input center'>
        <Input
          type='number'
          settings={{ float: true }}
          value={input.adminFee}
          onChange={(value) => handleNumberInputChange('adminFee', value)}
          disabled={readonly}
          errors={errors.adminFee}
        />
      </td>

      <td className='input center'>
        <Input
          type='number'
          settings={{ float: true }}
          value={input.rebate}
          onChange={(value) => handleNumberInputChange('rebate', value)}
          disabled={readonly}
          errors={errors.rebate}
        />
      </td>

      {!readonly && (
        <td className='action'>
          {showSave && (
            <button onClick={handleSave}>
              Save
            </button>
          )}
        </td>
      )}
    </tr>
  )
}

const QuestionnaireResponseRatesList = ({ state, onChangeState, rates, readonly }) => {
  const rate = getRateWithDate(rates)
  const beginDate = state.beginDate || rate.beginDate
  const endDate = state.endDate || rate.endDate

  return (
    <Fragment>
      <div className='rate-date-input-group'>
        <Group>
          <Input
            label='Begin Date'
            type='datepicker'
            value={beginDate}
            onChange={(value) => onChangeState('beginDate', value)}
          />
          <Input
            label='End Date'
            type='datepicker'
            value={endDate}
            onChange={(value) => onChangeState('endDate', value)}
          />
        </Group>
      </div>

      <table className='response-rates-table'>
        <thead>
          <tr>
            <th
              className='center'
              colSpan={3}
            >
              Indicators
            </th>

            <th className='center small'>
              Supply Group
            </th>
            <th></th>

            <th
              className='center'
              colSpan={2}
            >
              Fees
            </th>

            <th></th>
          </tr>
          <tr>
            <th>
              Mail Order
            </th>

            <th>
              Generic
            </th>

            <th>
              Specialty
            </th>

            <th className='center'>
              Days
            </th>

            <th className='input center'>
              Discount
            </th>

            <th className='input center'>
              Dispensing
            </th>

            <th className='input center'>
              Admin
            </th>

            <th className='input center'>
              Rebate
            </th>

            {!readonly && (
              <th className='action'>
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rates.map(rate => (
            <QuestionnaireResponseRate
              key={rate.id}
              rate={rate}
              dates={{
                start: beginDate,
                end: endDate
              }}
              readonly={readonly}
            />
          ))}
        </tbody>
      </table>
    </Fragment>

  )
}

QuestionnaireResponseRatesList.propTypes = {
  state: PropTypes.object,
  onChangeState: PropTypes.func,
  rates: PropTypes.array,
  readonly: PropTypes.bool
}

QuestionnaireResponseRatesList.defaultProps = {
  state: {},
  onChangeState: () => null,
  rates: [],
  readonly: true
}

QuestionnaireResponseRate.propTypes = {
  dates: PropTypes.object,
  rate: PropTypes.object,
  readonly: PropTypes.bool
}

QuestionnaireResponseRate.defaultProps = {
  dates: {},
  readonly: true
}

export default QuestionnaireResponseRatesList
