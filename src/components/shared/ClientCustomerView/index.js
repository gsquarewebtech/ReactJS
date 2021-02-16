import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import { Card } from '@lib'
import { Link } from '@shared'
import { Group, Info, Submit } from '@shared/Form'
import { time } from '@utils'

import clientCustomerGql from '@graphql/queries/client-customer'

const ClientCustomerView = ({ accountType, clientId, customerId, links, fields }) => {
  if (!customerId) {
    return null
  }

  const clientCustomerQuery = useQuery(clientCustomerGql, {
    variables: {
      id: customerId
    }
  })

  if (clientCustomerQuery.loading || clientCustomerQuery.error) {
    return null
  }

  const { clientCustomer } = clientCustomerQuery.data

  return (
    <Card>
      <div className='tab-pane'>
        <Group>
          {fields?.name?.show && (
            <Info
              label='Customer Name'
              value={clientCustomer.name}
            />
          )}

          {fields?.clientHq?.show && (
            <Info
              label='Client HQ'
              value={clientCustomer.clientHq}
            />
          )}
        </Group>

        <Group>
          {fields?.startDate?.show && (
            <Info
              label='Start Date'
              value={time.utc(clientCustomer.startDate).local().format('MMM. DD, YYYY')}
            />
          )}

          {fields?.currentPbm?.show && (
            <Info
              label='Current PBM'
              value={clientCustomer.currentPbm}
            />
          )}
        </Group>

        <Group>
          {fields?.clientType?.show && (
            <Info
              label='Client Type'
              value={clientCustomer.clientType?.name}
            />
          )}

          {fields?.industry?.show && (
            <Info
              label='Industry'
              value={clientCustomer.industry?.name}
            />
          )}
        </Group>

        <Group>
          {fields?.totalEmployees?.show && (
            <Info
              label='Total Employees'
              value={clientCustomer.totalEmployees}
            />
          )}

          {fields?.totalMembers?.show && (
            <Info
              label='Total Members'
              value={clientCustomer.totalMembers}
            />
          )}
        </Group>

        <Group>
          {fields?.totalAnnualRebates?.show && (
            <Info
              label='Total Annual Rebates'
              value={clientCustomer.totalAnnualRebates}
            />
          )}

          {fields?.monthsOfData?.show && (
            <Info
              label='Months of Data'
              value={clientCustomer.monthsOfData}
            />
          )}
        </Group>

        <Group>
          {fields?.formulary?.show && (
            <Info
              label='Formulary'
              value={clientCustomer.formulary?.name}
            />
          )}

          {fields?.salesPerson?.show && (
            <Info
              label='Salesperson'
              value={clientCustomer.salesPerson}
            />
          )}
        </Group>

        <Group>
          {fields?.otherInfo?.show && (
            <Info
              label='Other Information'
              value={clientCustomer.otherInfo}
            />
          )}
        </Group>

        <Submit className='right'>
          <Link
            to={`${links.edit}/${clientCustomer.id}`}
            className='button circle icon-left'
            icon='fal fa-pencil-alt'
            text='Edit'
          />
        </Submit>
      </div>
    </Card>
  )
}

ClientCustomerView.propTypes = {
  accountType: PropTypes.string,
  clientId: PropTypes.string,
  customerId: PropTypes.string,
  links: PropTypes.object,
  fields: PropTypes.object
}

ClientCustomerView.defaultProps = {
  links: {
    edit: '',
    newUser: ''
  },
  fields: {
    name: {
      show: false
    },
    clientHq: {
      show: false
    },
    startDate: {
      show: false
    },
    currentPbm: {
      show: false
    },
    clientType: {
      show: false
    },
    industry: {
      show: false
    },
    totalEmployees: {
      show: false
    },
    totalMembers: {
      show: false
    },
    totalAnnualRebates: {
      show: false
    },
    monthsOfData: {
      show: false
    },
    formulary: {
      show: false
    },
    salesPerson: {
      show: false
    },
    otherInfo: {
      show: false
    }
  }
}

export default ClientCustomerView
