import React, { Fragment } from 'react'
import { useQuery } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'

import Dashboard from '@wrappers/ClientDashboard'
import { Breadcrumb, Title, swal } from '@lib'
import { Link } from '@shared'
import { Action, Buttons } from '@shared/Action'
import ClientCustomerForm from '@shared/ClientCustomerForm'
import breadcrumbs from './breadcrumbs'

import clientGql from '@graphql/queries/client'

const Content = () => {
  const clientQuery = useQuery(clientGql)
  const { id } = useParams()
  const history = useHistory()

  if (clientQuery.loading) {
    return null
  }

  const { client } = clientQuery.data

  const handleSave = () => {
    swal({
      text: 'Client updated!',
      icon: 'success',
      buttons: false,
      timer: 1500
    })

    history.push('/client/customers')
  }

  const crumbs = [...breadcrumbs.index, {
    text: 'Edit Client',
    link: `/client/customer/edit/${id}`
  }]

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />

      <Title text='Edit Client' />

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
        accountType='client'
        id={id}
        clientId={client.id}
        onSave={handleSave}
      />
    </Fragment>
  )
}

const EditClientCustomer = () => {
  return (
    <Dashboard>
      <Content />
    </Dashboard>
  )
}

export default EditClientCustomer
