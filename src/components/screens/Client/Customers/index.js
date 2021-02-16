import React, { Fragment, useState } from 'react'
import { useQuery } from '@apollo/client'

import Dashboard from '@wrappers/ClientDashboard'
import { Breadcrumb, Title } from '@lib'
import { Link } from '@shared'
import { Action, Search, Buttons } from '@shared/Action'
import ClientCustomerList from '@shared/ClientCustomerList'
import breadcrumbs from './breadcrumbs'

import clientGql from '@graphql/queries/client'

const Content = () => {
  const [state, setState] = useState({})

  const handleSearchChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      search: value
    }))
  }

  const clientQuery = useQuery(clientGql)

  if (clientQuery.loading) {
    return null
  }

  const { client } = clientQuery.data

  return (
    <Fragment>
      <Breadcrumb crumbs={breadcrumbs.index} />
      <Title text={`${client.name} Clients`} />

      <Action className='background-white padded'>
        <Search
          placeholder='Search Client Customer ...'
          value={state.search || ''}
          onChange={(value) => handleSearchChange(value)}
        />
        <Buttons className='right'>
          <Link
            className='button circle icon-left'
            icon='fal fa-user-plus'
            text='New Client Customer'
            to='/client/customer/new'
          />
        </Buttons>
      </Action>

      <ClientCustomerList
        filters={{
          search: state.search
        }}
        clientId={client.id}
        links={{
          view: '/client/customer',
          edit: '/client/customer/edit'
        }}
      />
    </Fragment>
  )
}

const ClientCustomers = () => {
  return (
    <Dashboard>
      <Content />
    </Dashboard>
  )
}

export default ClientCustomers
