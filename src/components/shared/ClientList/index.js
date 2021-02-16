import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useQuery } from '@apollo/client'

import { Button, Avatar, swal, Pagination } from '@lib'
import { Link } from '@shared'
import { ListView, Item, Field } from '@shared/ListView'

import clientsGql from '@graphql/queries/clients'
import destroyClient from '@graphql/mutators/destroy-client'

const ClientList = ({ links, fields, itemClass, onDelete, filters }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showedClientCount, setShowedClientCount] = useState(5)

  // set search
  const variables = {}

  if (filters.search) {
    variables.search = filters.search
  }

  const clientsQuery = useQuery(clientsGql, { variables })

  if (clientsQuery.loading || clientsQuery.error) {
    return null
  }

  const { clients } = clientsQuery.data

  // pagination

  const clientsLength = clients.length
  const pages = Math.ceil(clientsLength / showedClientCount)

  const currentClients = []
  const startClientIndex = (currentPage - 1) * showedClientCount
  let endClientIndex = startClientIndex + (showedClientCount - 1)
  if (endClientIndex > (clientsLength - 1)) {
    endClientIndex = clientsLength - 1
  }

  for (let i = startClientIndex; i <= endClientIndex; i++) {
    const client = clients[i]
    currentClients.push(
      client
    )
  }

  const handlePageClick = (page) => {
    setCurrentPage(page)
  }

  const handlePaginationSizeChange = (size) => {
    setCurrentPage(1)
    setShowedClientCount(size)
  }
  // end

  const handleDelete = (client) => {
    swal({
      text: 'Are you sure you want to delete this client?',
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
        destroyClient(client.id).then(() => {
          onDelete(client)
          swal({
            text: 'Client deleted!',
            icon: 'success',
            buttons: false,
            timer: 1500
          })
        })
      }
    })
  }

  return (
    <ListView>
      {currentClients.map(client => (
        <Item
          key={client.id}
          className={classNames(itemClass)}
        >
          {fields.avatar && (
            <Field
              className='item-avatar'
              noLabel
            >
              <Avatar
                className='circle'
                url={`https://ui-avatars.com/api/?background=288ca7&color=fff&name=${client.name}`}
              />
            </Field>
          )}

          {fields.name && (
            <Field label='Name'>
              <Link to={`${links.view}/${client.id}`}>
                {client.name}
              </Link>
            </Field>
          )}

          {fields.action && (
            <Field
              className='item-action'
              noLabel
            >
              <Link
                className='button blue'
                to={`${links.edit}/${client.id}`}
                icon='fal fa-pencil-alt'
              />
              <Button
                className='red'
                onClick={() => handleDelete(client)}
                icon='fal fa-trash'
              />
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
        selectedSize={showedClientCount}
        onSizeChange={handlePaginationSizeChange}
      />
    </ListView>
  )
}

ClientList.propTypes = {
  links: PropTypes.object,
  fields: PropTypes.object,
  itemClass: PropTypes.string,
  onDelete: PropTypes.func,
  filters: PropTypes.object
}

ClientList.defaultProps = {
  links: {
    view: '',
    edit: ''
  },
  fields: {
    avatar: true,
    name: true,
    action: true
  },
  onDelete: () => null,
  filters: {}
}

export default ClientList
