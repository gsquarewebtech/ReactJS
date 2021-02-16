import React, { Fragment } from 'react'
import { useParams, useLocation } from 'react-router-dom'

import Dashboard from '@wrappers/AdminDashboard'
import { Breadcrumb, Title } from '@lib'
import { Link } from '@shared'
import { Action, Buttons } from '@shared/Action'

import ClientView from '@shared/ClientView'
import breadcrumbs from './breadcrumbs'

const Content = () => {
  const { id } = useParams()
  const { hash } = useLocation()

  const crumbs = [...breadcrumbs.index, {
    text: 'Client Info',
    link: `/admin/client/${id}`
  }]

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />

      <Title text='Client View' />

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

      <ClientView
        clientId={id}
        selectedTab={hash}
        links={{
          edit: '/admin/client/edit',
          newUser: `/admin/client/${id}/user/new`,
          newCustomer: `/admin/client/${id}/customer/new`,
          newVendor: `/admin/client/${id}/vendor/new`,
          editUser: `/admin/client/${id}/user/edit`
        }}
        fields={{
          details: {
            name: {
              show: true
            },
            startDate: {
              show: true
            },
            currentPbm: {
              show: true
            },
            clientType: {
              show: true
            },
            industry: {
              show: true
            },
            totalEmployees: {
              show: true
            },
            totalMembers: {
              show: true
            },
            totalAnnualRebates: {
              show: true
            },
            monthsOfData: {
              show: true
            },
            formulary: {
              show: true
            },
            otherInfo: {
              show: true
            }
          },
          users: {
            avatar: {
              show: true
            },
            email: {
              show: true
            },
            name: {
              show: true
            },
            isMain: {
              show: true
            },
            actions: {
              edit: true,
              delete: true
            }
          },
          clientCustomers: {
            avatar: {
              show: true
            },
            name: {
              show: true
            },
            actions: {
              edit: true,
              delete: true
            }
          },
          vendors: {
            avatar: {
              show: true
            },
            name: {
              show: true
            },
            actions: {
              edit: true,
              delete: true
            }
          }
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
