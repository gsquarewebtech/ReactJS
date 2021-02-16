import React, { Fragment } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import Dashboard from '@wrappers/AdminDashboard'
import { Breadcrumb, Title, swal } from '@lib'
import { Link } from '@shared'
import { Action, Buttons } from '@shared/Action'
import ClientCustomerForm from '@shared/ClientCustomerForm'
import breadcrumbs from './breadcrumbs'

const Content = () => {
  const { clientId, customerId } = useParams()
  const history = useHistory()

  const handleSave = () => {
    swal({
      text: 'Client customer updated!',
      icon: 'success',
      buttons: false,
      timer: 1500
    })

    history.push(`/admin/client/${clientId}#customers`)
  }

  const crumbs = [...breadcrumbs.index, {
    text: 'Client Info',
    link: `/admin/client/${clientId}#customers`
  },
  {
    text: 'Edit Customer',
    link: `/admin/client/${clientId}/customer/${customerId}`
  }]

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />

      <Title text='Edit Client Customer' />

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
        accountType='client'
        id={customerId}
        clientId={clientId}
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
