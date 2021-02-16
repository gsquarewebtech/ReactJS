import React, { Fragment } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'

import Dashboard from '@wrappers/AdminDashboard'
import { Breadcrumb, Title, swal } from '@lib'
import { Link } from '@shared'
import { Action, Buttons } from '@shared/Action'
import ClientForm from '@shared/ClientForm'

import breadcrumbs from './breadcrumbs'

const Content = () => {
  const { id } = useParams()
  const history = useHistory()
  const { hash } = useLocation()

  const crumbs = [...breadcrumbs.index, {
    text: 'Client Info',
    link: `/admin/client/${id}#details`
  },
  {
    text: 'Edit Details',
    link: `/admin/client/edit/${id}`
  }]

  const handleSave = () => {
    history.push('/admin/clients')
    swal({
      text: 'Client updated!',
      icon: 'success',
      buttons: false,
      timer: 1500
    })
  }

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />
      <Title text='Edit Client' />

      <Action>
        <Buttons className='flex'>
          <Link
            className='button small circle red icon-left'
            to={`/admin/client/${id}#details`}
            icon='fal fa-arrow-left'
            text='Back'
          />
        </Buttons>
      </Action>

      <ClientForm
        id={id}
        selectedTab={hash}
        onSave={handleSave}
      />
    </Fragment>
  )
}

const EditClient = () => {
  return (
    <Dashboard>
      <Content />
    </Dashboard>
  )
}

export default EditClient
