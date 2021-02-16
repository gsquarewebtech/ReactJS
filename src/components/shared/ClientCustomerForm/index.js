import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from '@lib'
import { Link } from '@shared'
import { Group, Input, FormError, Submit } from '@shared/Form'
import { array, object, time } from '@utils'

import client from '@graphql/client'
import clientCustomerGql from '@graphql/queries/client-customer'
import clientTypesGql from '@graphql/queries/client-types'
import clientIndustriesGql from '@graphql/queries/client-industries'
import clientFormulariesGql from '@graphql/queries/client-formularies'
import createClientCustomer from '@graphql/mutators/create-client-customer'
import updateClientCustomer from '@graphql/mutators/update-client-customer'

const ClientCustomerForm = ({ id, clientId, selectedTab, onSave }) => {
  const [input, setInput] = useState({
    clientId,
    name: '',
    clientHq: '',
    startDate: null,
    clientTypeId: null,
    totalEmployees: null,
    totalMembers: null,
    totalAnnualRebates: null,
    currentPbm: '',
    industryId: null,
    monthsOfData: null,
    formularyId: null,
    salesPerson: '',
    otherInfo: ''
  })

  const [loading, setLoading] = useState(true)
  const [currentTab, setTab] = useState(selectedTab || '#basic')
  const [inputErrors, setInputErrors] = useState({})

  useEffect(() => {
    if (id && loading) {
      const variables = { id }

      if (clientId) {
        variables.clientId = clientId
      }

      client.query({
        query: clientCustomerGql,
        variables
      }).then(({ data }) => {
        if (data.clientCustomer) {
          let startDate = null
          if (data.clientCustomer?.startDate) {
            startDate = time.utc(data.clientCustomer?.startDate).local().toDate()
          }

          setInput({
            id: data.clientCustomer.id,
            clientId,
            name: data.clientCustomer.name,
            clientHq: data.clientCustomer?.clientHq,
            startDate,
            clientTypeId: data.clientCustomer?.clientTypeId,
            totalEmployees: data.clientCustomer?.totalEmployees,
            totalMembers: data.clientCustomer?.totalMembers,
            totalAnnualRebates: data.clientCustomer?.totalAnnualRebates,
            currentPbm: data.clientCustomer?.currentPbm,
            industryId: data.clientCustomer?.industryId,
            monthsOfData: data.clientCustomer?.monthsOfData,
            formularyId: data.clientCustomer?.formularyId,
            salesPerson: data.clientCustomer?.salesPerson,
            otherInfo: data.clientCustomer?.otherInfo
          })
          setLoading(false)
        }
      })
    }
  }, [loading])

  const history = useHistory()

  const clientTypesQuery = useQuery(clientTypesGql)
  const clientIndustriesQuery = useQuery(clientIndustriesGql)
  const clientFormulariesQuery = useQuery(clientFormulariesGql)

  const handleTabChange = (tab) => {
    history.push(`${tab}`)
    setTab(tab)
  }

  if (clientTypesQuery.loading || clientIndustriesQuery.loading || clientFormulariesQuery.loading) {
    return null
  }

  if (id && loading) {
    return null
  }

  const { clientTypes } = clientTypesQuery.data
  const { clientIndustries } = clientIndustriesQuery.data
  const { clientFormularies } = clientFormulariesQuery.data

  const handleInputChange = (name, value) => {
    const newInput = { ...input }
    newInput[name] = value
    setInput(newInput)
  }

  const handleSave = () => {
    const feErrors = {}

    if (!input.name) {
      feErrors.name = [{
        message: 'Customer Name is required'
      }]
    }

    if (!input.startDate) {
      feErrors.startDate = [{
        message: 'Start Date is required'
      }]
    }

    if (!input.currentPbm) {
      feErrors.currentPbm = [{
        message: 'Current PBM is required'
      }]
    }

    if (!input.clientTypeId) {
      feErrors.clientTypeId = [{
        message: 'Client Type is required'
      }]
    }

    if (!input.industryId) {
      feErrors.industryId = [{
        message: 'Industry is required'
      }]
    }

    if (!input.totalEmployees) {
      feErrors.totalEmployees = [{
        message: 'Total Employees is required'
      }]
    }

    if (!input.totalMembers) {
      feErrors.totalMembers = [{
        message: 'total members is required'
      }]
    }

    if (!input.totalAnnualRebates) {
      feErrors.totalAnnualRebates = [{
        message: 'Total Annual Rebates is required'
      }]
    }

    if (!input.monthsOfData) {
      feErrors.monthsOfData = [{
        message: 'Months of Data is required'
      }]
    }

    if (!object.keys(feErrors).length) {
      input.startDate = time.utc(input.startDate).format()

      if (id) {
        updateClientCustomer(input).then(({ data, extensions }) => {
          if (data.updateClientCustomer) {
            setInputErrors({})
            onSave()
          } else if (extensions && extensions.errors) {
            setInputErrors(array.groupBy(extensions.errors, 'path'))
          }
        })
      } else {
        createClientCustomer(input).then(({ data, extensions }) => {
          if (data.createClientCustomer) {
            setInputErrors({})
            onSave()
          } else if (extensions && extensions.errors) {
            setInputErrors(array.groupBy(extensions.errors, 'path'))
          }
        })
      }
    } else {
      setInputErrors(feErrors)
    }
  }

  // set tab errors
  let clientBasicErrors = []
  let keyMetricErrors = []
  let lastTabErrors = []

  // client basics error
  if (inputErrors.name) {
    clientBasicErrors = clientBasicErrors.concat(inputErrors.name)
  }

  if (inputErrors.startDate) {
    clientBasicErrors = clientBasicErrors.concat(inputErrors.startDate)
  }

  if (inputErrors.currentPbm) {
    clientBasicErrors = clientBasicErrors.concat(inputErrors.currentPbm)
  }

  if (inputErrors.clientTypeId) {
    clientBasicErrors = clientBasicErrors.concat(inputErrors.clientTypeId)
  }

  if (inputErrors.industryId) {
    clientBasicErrors = clientBasicErrors.concat(inputErrors.industryId)
  }

  // key metric errors
  if (inputErrors.totalEmployees) {
    keyMetricErrors = keyMetricErrors.concat(inputErrors.totalEmployees)
  }

  if (inputErrors.totalMembers) {
    keyMetricErrors = keyMetricErrors.concat(inputErrors.totalMembers)
  }

  if (inputErrors.totalAnnualRebates) {
    keyMetricErrors = keyMetricErrors.concat(inputErrors.totalAnnualRebates)
  }

  if (inputErrors.monthsOfData) {
    keyMetricErrors = keyMetricErrors.concat(inputErrors.monthsOfData)
  }

  // last tab errors
  if (clientBasicErrors.length || keyMetricErrors.length) {
    lastTabErrors = [{ message: 'Fill all the required fields' }]
  }

  return (
    <div className='tab-view'>
      <ul className='tab-navs'>
        <li className={classNames({ active: currentTab === '#basic' })}>
          <Link
            text='Customer Basics'
            to='#basic'
            onClick={() => { setTab('#basic') }}
          />
        </li>
        <li className={classNames({ active: currentTab === '#key-metric' })}>
          <Link
            text='Key Metrics'
            to='#key-metric'
            onClick={() => { setTab('#key-metric') }}
          />

        </li>
        <li className={classNames({ active: currentTab === '#other-info' })}>
          <Link
            text='Other Info'
            to='#other-info'
            onClick={() => { setTab('#other-info') }}
          />
        </li>
      </ul>

      <div className='tab-panes padded'>
        {currentTab === '#basic' && (
          <div className='tab-pane'>
            <FormError errors={clientBasicErrors} />

            <Group>
              <Input
                label='Customer Name'
                type='text'
                value={input.name}
                onChange={(value) => handleInputChange('name', value)}
                errors={inputErrors.name}
              />

              <Input
                label='Client HQ'
                type='text'
                value={input.clientHq}
                onChange={(value) => handleInputChange('clientHq', value)}
                errors={inputErrors.clientHq}
              />
            </Group>

            <Group>
              <Input
                label='Start Date'
                type='datepicker'
                value={input.startDate}
                settings={{ dateFormat: 'M. d, Y' }}
                onChange={(value) => handleInputChange('startDate', value)}
                errors={inputErrors.startDate}
              />

              <Input
                label='Current PBM'
                type='text'
                value={input.currentPbm}
                onChange={(value) => handleInputChange('currentPbm', value)}
                errors={inputErrors.currentPbm}
              />
            </Group>

            <Group>
              <Input
                label='Client Type'
                type='select'
                placeholder='Select Client Type'
                options={clientTypes.map(option => ({ value: option.id, text: option.name }))}
                value={input.clientTypeId}
                onChange={(value) => handleInputChange('clientTypeId', value)}
                errors={inputErrors.clientTypeId}
              />

              <Input
                label='Industry'
                type='select'
                placeholder='Select Industry'
                options={clientIndustries.map(option => ({ value: option.id, text: option.name }))}
                value={input.industryId}
                onChange={(value) => handleInputChange('industryId', value)}
                errors={inputErrors.industryId}
              />
            </Group>

            <Submit className='right'>
              <Button
                className='circle icon-right'
                icon='fal fa-arrow-right'
                iconAlign='right'
                text='Next'
                onClick={() => handleTabChange('#key-metric')}
              />
            </Submit>
          </div>
        )}

        {currentTab === '#key-metric' && (
          <div className='tab-pane'>
            <FormError errors={keyMetricErrors} />

            <Group>
              <Input
                label='Total Employees'
                type='number'
                value={input.totalEmployees}
                onChange={(value) => handleInputChange('totalEmployees', parseInt(value))}
                errors={inputErrors.totalEmployees}
              />

              <Input
                label='Total Members'
                type='number'
                value={input.totalMembers}
                onChange={(value) => handleInputChange('totalMembers', parseInt(value))}
                errors={inputErrors.totalMembers}
              />
            </Group>

            <Group>
              <Input
                label='Total Annual Rebates'
                type='number'
                value={input.totalAnnualRebates}
                onChange={(value) => handleInputChange('totalAnnualRebates', parseFloat(value))}
                errors={inputErrors.totalAnnualRebates}
              />

              <Input
                label='Months of Data'
                type='number'
                value={input.monthsOfData}
                onChange={(value) => handleInputChange('monthsOfData', parseInt(value))}
                errors={inputErrors.monthsOfData}
              />
            </Group>

            <Submit className='space-between'>
              <Button
                className='circle icon-left'
                icon='fal fa-arrow-left'
                text='Back'
                onClick={() => handleTabChange('#basic')}
              />
              <Button
                className='circle icon-right'
                icon='fal fa-arrow-right'
                iconAlign='right'
                text='Next'
                onClick={() => handleTabChange('#other-info')}
              />
            </Submit>
          </div>
        )}

        {currentTab === '#other-info' && (
          <div className='tab-pane'>
            <FormError errors={lastTabErrors} />

            <Group>
              <Input
                label='Formulary'
                type='select'
                placeholder='Select Formulary'
                options={clientFormularies.map(option => ({ value: option.id, text: option.name }))}
                value={input.formularyId || ''}

                onChange={(value) => handleInputChange('formularyId', value)}
                errors={inputErrors.formularyId}
              />

              <Input
                label='Salesperson'
                type='text'
                value={input.salesPerson}
                onChange={(value) => handleInputChange('salesPerson', value)}
                errors={inputErrors.salesPerson}
              />
            </Group>

            <Group>
              <Input
                label='Other Information'
                type='textarea'
                value={input.otherInfo}
                onChange={(value) => handleInputChange('otherInfo', value)}
                errors={inputErrors.otherInfo}
              />
            </Group>

            <Submit className='space-between'>
              <Button
                className='left circle icon-left'
                icon='fal fa-arrow-left'
                text='Back'
                onClick={() => handleTabChange('#key-metric')}
              />
              <Button
                className='right circle'
                text={`${id ? 'Update' : 'Add'} Customer`}
                onClick={handleSave}
              />
            </Submit>
          </div>
        )}
      </div>
    </div>
  )
}

ClientCustomerForm.propTypes = {
  id: PropTypes.string,
  clientId: PropTypes.string,
  selectedTab: PropTypes.string,
  onSave: PropTypes.func
}

ClientCustomerForm.defaultProps = {
  id: '',
  clientId: null,
  onSave: () => {}
}

export default ClientCustomerForm
