import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import { Flex, Pagination } from '@lib'
import { Directory } from '@shared'
import { ListView } from '@shared/ListView'

import clientsGql from '@graphql/queries/clients'

const ClientSelectionList = ({ links }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showedClientCount, setShowedClientCount] = useState(10)

  // set search
  const variables = {}

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

  return (
    <ListView>
      <Flex>
        <div className='directories'>
          {currentClients.map(client => (
            <Directory
              key={client.id}
              link={`${links.view}${client.id}`}
              text={`${client.name}`}
            />
          ))}
        </div>
      </Flex>

      <Pagination
        className='centered'
        pages={pages}
        limit={10}
        currentPage={currentPage}
        onPageClick={handlePageClick}
        sizes={[10, 20, 30, 50, 100]}
        selectedSize={showedClientCount}
        onSizeChange={handlePaginationSizeChange}
      />
    </ListView>
  )
}

ClientSelectionList.propTypes = {
  links: PropTypes.object
}

ClientSelectionList.defaultProps = {
  links: {
    view: '',
    edit: ''
  }
}

export default ClientSelectionList
