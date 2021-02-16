import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import Dashboard from '@wrappers/AdminDashboard'
import { Breadcrumb, Title } from '@lib'
import { Link } from '@shared'
import { Action, Buttons } from '@shared/Action'

import ClientCustomerView from '@shared/ClientCustomerView'
import breadcrumbs from './breadcrumbs'

const Content = () => {
  const { clientId, customerId } = useParams()

  const crumbs = [...breadcrumbs.index, {
    text: 'Client Info',
    link: `/admin/client/${clientId}#users`
  },
  {
    text: 'View Customer',
    link: `/admin/client/${clientId}/customer/${customerId}`
  }]

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />

      <Title text='Client Customer View' />

      <Action>
        <Buttons className='flex'>
          <Link
            className='button small circle red icon-left'
            to={`/admin/client/${clientId}#customers`}
            icon='fal fa-arrow-left'
            text='Back'
          />
        </Buttons>
      </Action>

      <ClientCustomerView
        accountType='client'
        clientId={clientId}
        customerId={customerId}
        links={{
          edit: `/admin/client/${clientId}/customer/edit`
        }}
        fields={{
          name: {
            show: true
          },
          clientHq: {
            show: true
          },
          startDate: {
            show: true
          },
          currentPbm: {
            show: true
          },
          clientType: {
            show: true
          },
          industry: {
            show: true
          },
          totalEmployees: {
            show: true
          },
          totalMembers: {
            show: true
          },
          totalAnnualRebates: {
            show: true
          },
          monthsOfData: {
            show: true
          },
          formulary: {
            show: true
          },
          salesPerson: {
            show: true
          },
          otherInfo: {
            show: true
          }
        }}
      />
    </Fragment>
  )
}

const ViewClientCustomer = () => {
  return (
    <Dashboard>
      <Content />
    </Dashboard>
  )
}

export default ViewClientCustomer
