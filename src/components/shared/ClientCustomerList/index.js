import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import { Avatar, Button, swal, Pagination } from '@lib'
import { Link } from '@shared'
import { ListView, Item, Field } from '@shared/ListView'

import clientCustomersGql from '@graphql/queries/client-customers'
import destroyClientCustomer from '@graphql/mutators/destroy-client-customer'

const ClientCustomerList = ({ clientId, fields, links, actions, onDelete, filters }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showedClientCustomerCount, setShowedClientCustomerCount] = useState(5)

  if (!clientId) {
    return null
  }

  // set search
  const variables = { clientId }

  if (filters.search) {
    variables.search = filters.search
  }

  // clientCustomers query

  const clientCustomersQuery = useQuery(clientCustomersGql, {
    variables,
    fetchPolicy: 'network-only'
  })

  if (clientCustomersQuery.loading || clientCustomersQuery.error) {
    return null
  }

  const { clientCustomers } = clientCustomersQuery.data

  if (!clientCustomers) {
    return null
  }

  // pagination
  const clientCustomersLength = clientCustomers.length
  const pages = Math.ceil(clientCustomersLength / showedClientCustomerCount)

  const currentClientCustomers = []
  const startClientCustomerIndex = (currentPage - 1) * showedClientCustomerCount
  let endClientCustomerIndex = startClientCustomerIndex + (showedClientCustomerCount - 1)
  if (endClientCustomerIndex > (clientCustomersLength - 1)) {
    endClientCustomerIndex = clientCustomersLength - 1
  }

  for (let i = startClientCustomerIndex; i <= endClientCustomerIndex; i++) {
    const clientCustomer = clientCustomers[i]
    currentClientCustomers.push(
      clientCustomer
    )
  }

  const handlePageClick = (page) => {
    setCurrentPage(page)
  }

  const handlePaginationSizeChange = (size) => {
    setCurrentPage(1)
    setShowedClientCustomerCount(size)
  }
  // end

  const handleDelete = (clientCustomer) => {
    swal({
      text: 'Are you sure you want to delete this client customer?',
      icon: 'warning',
      buttons: {
        delete: {
          text: 'Yes',
          value: 'delete'
        },
        cancel: 'Cancel'
      }
    }).then((value) => {
      if (value === 'delete') {
        destroyClientCustomer(clientCustomer.id, 'client').then(({ data, extensions }) => {
          if (data.destroyClientCustomer) {
            swal({
              text: 'Client customer deleted!',
              icon: 'success',
              buttons: false,
              timer: 1500
            })
          } else if (extensions && extensions.errors) {
            swal({
              text: extensions?.errors[0].message,
              icon: 'error',
              buttons: false,
              timer: 2500
            })
            console.log('Logger::extesions.errorsTest', extensions.errors)
          }
        })
      }
    })
  }

  return (
    <Fragment>
      <ListView>
        {currentClientCustomers.map(clientCustomer => (
          <Item
            key={clientCustomer.id}
            className='border-bottom background-white'
          >
            {fields.avatar && (
              <Field
                className='item-avatar'
                noLabel
              >
                <Avatar
                  className='circle'
                  url={`https://ui-avatars.com/api/?background=288ca7&color=fff&name=${clientCustomer.name}`}
                />
              </Field>
            )}

            {fields.name && (
              <Field label='Name'>
                <Link to={`${links.view}/${clientCustomer.id}`}>
                  {clientCustomer.name}
                </Link>
              </Field>
            )}

            {actions.newRequest && (
              <Link
                className='button blue circle with-text'
                text='Select'
                to={`${links.newRequest}/${clientCustomer.id}/request/new`}
              />
            )}

            {fields.actions && (
              <Field
                className='item-action'
                noLabel
              >
                {fields.actions.edit && (
                  <Link
                    className='button blue'
                    to={`${links.edit}/${clientCustomer.id}`}
                    icon='fal fa-pencil-alt'
                  />
                )}

                {fields.actions.delete && (
                  <Button
                    className='red'
                    onClick={() => handleDelete(clientCustomer)}
                    icon='fal fa-trash'
                  />
                )}
              </Field>
            )}
          </Item>
        ))}

        <Pagination
          className='centered'
          pages={pages}
          limit={10}
          currentPage={currentPage}
          onPageClick={handlePageClick}
          sizes={[5, 10, 25, 50, 100]}
          selectedSize={showedClientCustomerCount}
          onSizeChange={handlePaginationSizeChange}
        />
      </ListView>
    </Fragment>

  )
}

ClientCustomerList.propTypes = {
  clientId: PropTypes.string,
  fields: PropTypes.object,
  links: PropTypes.object,
  actions: PropTypes.object,
  onDelete: PropTypes.func,
  filters: PropTypes.object
}

ClientCustomerList.defaultProps = {
  fields: {
    avatar: true,
    name: true,
    actions: {
      edit: true,
      delete: true
    }
  },
  links: {
    view: '',
    edit: ''
  },
  actions: {
    newRequest: false
  },
  onDelete: () => {},
  filters: {}
}

export default ClientCustomerList
