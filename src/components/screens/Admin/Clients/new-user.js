import React, { Fragment } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import Dashboard from '@wrappers/AdminDashboard'
import { Breadcrumb, Title, swal } from '@lib'
import { Link } from '@shared'
import { Action, Buttons } from '@shared/Action'
import AccountUserForm from '@shared/AccountUserForm'
import breadcrumbs from './breadcrumbs'

const Content = () => {
  const { id } = useParams()
  const history = useHistory()

  const crumbs = [...breadcrumbs.index,
    {
      text: 'Client Info',
      link: `/admin/client/${id}#users`
    },
    {
      text: 'New User',
      link: `/admin/client/${id}/user/new`
    }
  ]

  const handleSave = () => {
    swal({
      text: 'User added!',
      icon: 'success',
      buttons: false,
      timer: 1500
    })

    history.push(`/admin/client/${id}#users`)
  }

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />

      <Title text='New Client User' />

      <Action>
        <Buttons className='flex'>
          <Link
            className='button small circle red icon-left'
            to={`/admin/client/${id}#users`}
            icon='fal fa-arrow-left'
            text='Back'
          />
        </Buttons>
      </Action>

      <AccountUserForm
        accountType='client'
        accountId={id}
        onSave={handleSave}
        fields={{
          email: {
            show: true,
            enable: true
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

const NewClientUser = () => {
  return (
    <Dashboard>
      <Content />
    </Dashboard>
  )
}

export default NewClientUser
