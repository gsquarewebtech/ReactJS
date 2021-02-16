import React, { Fragment } from 'react'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

import Dashboard from '@wrappers/ClientDashboard'
import { Breadcrumb, Title } from '@lib'
import { Link } from '@shared'
import { Action, Buttons } from '@shared/Action'

import ClientCustomerView from '@shared/ClientCustomerView'
import breadcrumbs from './breadcrumbs'

import clientGql from '@graphql/queries/client'

const Content = () => {
  const clientQuery = useQuery(clientGql)
  const { id } = useParams()

  if (clientQuery.loading) {
    return null
  }

  const { client } = clientQuery.data

  const crumbs = [...breadcrumbs.index, {
    text: 'Client Info',
    link: `/client/customer/${id}`
  }]

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />

      <Title text='Client View' />

      <Action>
        <Buttons className='flex'>
          <Link
            className='button small circle red icon-left'
            to={'/client/customers'}
            icon='fal fa-arrow-left'
            text='Back'
          />
        </Buttons>
      </Action>

      <ClientCustomerView
        accountType='client'
        clientId={client.id}
        customerId={id}
        links={{
          edit: '/client/customer/edit'
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
