import React, { Fragment } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import Dashboard from '@wrappers/AdminDashboard'
import { Breadcrumb, Title, swal } from '@lib'
import { Link } from '@shared'
import { Action, Buttons } from '@shared/Action'
import ClientCustomerForm from '@shared/ClientCustomerForm'
import breadcrumbs from './breadcrumbs'

const Content = () => {
  const { clientId } = useParams()
  const history = useHistory()

  const crumbs = [...breadcrumbs.index,
    {
      text: 'Client Info',
      link: `/admin/client/${clientId}#users`
    },
    {
      text: 'New Customer',
      link: `/admin/client/${clientId}/user/new`
    }
  ]

  const handleSave = () => {
    swal({
      text: 'Client customer added!',
      icon: 'success',
      buttons: false,
      timer: 1500
    })

    history.push(`/admin/client/${clientId}#customers`)
  }

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />

      <Title text='New Client Customer' />

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

      <ClientCustomerForm
        clientId={clientId}
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
