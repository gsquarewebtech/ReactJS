import React, { Fragment } from 'react'
import { useQuery } from '@apollo/client'
import { useHistory, useLocation } from 'react-router-dom'

import Dashboard from '@wrappers/ClientDashboard'
import { Breadcrumb, Title, swal } from '@lib'
import { Link } from '@shared'
import { Action, Buttons } from '@shared/Action'
import ClientCustomerForm from '@shared/ClientCustomerForm'
import breadcrumbs from './breadcrumbs'

import clientGql from '@graphql/queries/client'

const Content = () => {
  const clientQuery = useQuery(clientGql)

  const history = useHistory()
  const { hash } = useLocation()

  if (clientQuery.loading) {
    return null
  }

  const { client } = clientQuery.data

  const handleSave = () => {
    swal({
      text: 'Customer added!',
      icon: 'success',
      buttons: false,
      timer: 1500
    })

    history.push('/client/customers')
  }

  const crumbs = [...breadcrumbs.index, {
    text: 'New Customer',
    link: '/client/customer/new'
  }]

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />

      <Title text='New Customer' />

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

      <ClientCustomerForm
        clientId={client.id}
        selectedTab={hash}
        onSave={handleSave}
      />
    </Fragment>
  )
}

const NewClientCustomer = () => {
  return (
    <Dashboard>
      <Content />
    </Dashboard>
  )
}

export default NewClientCustomer
