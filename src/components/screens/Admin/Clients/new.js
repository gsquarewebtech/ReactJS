import React, { Fragment } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import Dashboard from '@wrappers/AdminDashboard'
import { Breadcrumb, Title, swal } from '@lib'
import { Link } from '@shared'
import { Action, Buttons } from '@shared/Action'
import ClientForm from '@shared/ClientForm'
import breadcrumbs from './breadcrumbs'

const Content = () => {
  const history = useHistory()
  const { hash } = useLocation()

  const crumbs = [...breadcrumbs.index, {
    text: 'New Client',
    link: '/admin/client/new'
  }]

  const handleSave = () => {
    history.push('/admin/clients')
    swal({
      text: 'Client added!',
      icon: 'success',
      buttons: false,
      timer: 1500
    })
  }

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />
      <Title text='New Client' />

      <Action>
        <Buttons className='flex'>
          <Link
            className='button small circle red icon-left'
            to='/admin/clients'
            icon='fal fa-arrow-left'
            text='Back'
          />
        </Buttons>
      </Action>

      <ClientForm
        selectedTab={hash}
        onSave={handleSave}
      />
    </Fragment>
  )
}

const NewClient = () => {
  return (
    <Dashboard>
      <Content />
    </Dashboard>
  )
}

export default NewClient
