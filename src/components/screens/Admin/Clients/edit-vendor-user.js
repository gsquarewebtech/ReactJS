import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import Dashboard from '@wrappers/AdminDashboard'
import { Breadcrumb, Title, swal } from '@lib'
import { Link } from '@shared'
import { Action, Buttons } from '@shared/Action'
import AccountUserForm from '@shared/AccountUserForm'
import breadcrumbs from './breadcrumbs'

const Content = () => {
  const { clientId, vendorId, accountUserId } = useParams()

  const crumbs = [...breadcrumbs.index,
    {
      text: 'Client Info',
      link: `/admin/client/${clientId}#vendors`
    },
    {
      text: 'Client Vendors',
      link: `/admin/client/${clientId}/vendor/${vendorId}`
    }
  ]

  const handleSaveAccountUser = () => {
    swal({
      text: 'User updated!',
      icon: 'success',
      buttons: false,
      timer: 1500
    })
  }

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />
      <Title text='Edit Vendor User' />

      <Action>
        <Buttons className='flex'>
          <Link
            className='button small circle red icon-left'
            to={`/admin/client/${clientId}/vendor/${vendorId}#users`}
            icon='fal fa-arrow-left'
            text='Back'
          />
        </Buttons>
      </Action>

      <AccountUserForm
        mode='client'
        accountType='vendor'
        accountId={vendorId}
        clientId={clientId}
        userId={accountUserId}
        onSave={handleSaveAccountUser}
        fields={{
          email: {
            show: true,
            enable: false
          },
          phone: {
            show: true,
            enable: true
          },
          title: {
            show: true,
            enable: true
          },
          firstName: {
            show: true,
            enable: true
          },
          lastName: {
            show: true,
            enable: true
          },
          notes: {
            show: true,
            enable: true
          },
          isMain: {
            show: true,
            enable: true
          },
          saveButton: true
        }}
      />
    </Fragment>
  )
}

const EditVendorUser = () => {
  return (
    <Dashboard>
      <Content />
    </Dashboard>
  )
}

export default EditVendorUser
