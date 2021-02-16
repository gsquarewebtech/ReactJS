import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import Dashboard from '@wrappers/AdminDashboard'
import { Breadcrumb, Title } from '@lib'
import { Link } from '@shared'
import { Action, Buttons } from '@shared/Action'

import AccountUserView from '@shared/AccountUserView'
import breadcrumbs from './breadcrumbs'

const Content = () => {
  const { clientId, userId } = useParams()

  const crumbs = [...breadcrumbs.index, {
    text: 'Client Info',
    link: `/admin/client/${clientId}#users`
  },
  {
    text: 'View User',
    link: `/admin/client/${clientId}/user/${userId}`
  }]

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />

      <Title text='Client User View' />

      <Action>
        <Buttons className='flex'>
          <Link
            className='button small circle red icon-left'
            to={`/admin/client/${clientId}#users`}
            icon='fal fa-arrow-left'
            text='Back'
          />
        </Buttons>
      </Action>

      <AccountUserView
        accountType='client'
        accountId={clientId}
        userId={userId}
        links={{
          edit: `/admin/client/${clientId}/user/edit`
        }}
      />
    </Fragment>
  )
}

const ViewClient = () => {
  return (
    <Dashboard>
      <Content />
    </Dashboard>
  )
}

export default ViewClient
