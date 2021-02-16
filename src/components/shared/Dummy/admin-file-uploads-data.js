import React from 'react'
import faker from 'faker'
import { Table, Row, Column, Link, Icon } from '@lib'

const dummyData = []
for (let i = 0; i < 10; i++) {
  dummyData.push({
    username: faker.internet.userName(),
    name: faker.company.companyName(),
    primaryContact: faker.name.findName(),
    email: faker.internet.email().toLowerCase()
  })
}

const datas = [
  {
    id: 1,
    name: 'Demo File 1',
    client: {
      name: 'Demo Client 1'
    },
    uploader: 'Demo User 1',
    created: '2020-01-01 00:00:00'
  },
  {
    id: 2,
    name: 'Demo File 2',
    client: {
      name: 'Demo Client 1'
    },
    uploader: 'Demo User 1',
    created: '2020-01-01 00:00:00'
  },
  {
    id: 3,
    name: 'Demo File 3',
    client: {
      name: 'Demo Client 2'
    },
    uploader: 'Demo User 2',
    created: '2020-01-01 00:00:00'
  },
  {
    id: 4,
    name: 'Demo File 4',
    client: {
      name: 'Demo Client 2'
    },
    uploader: 'Demo User 2',
    created: '2020-01-01 00:00:00'
  },
  {
    id: 5,
    name: 'Demo File 5',
    client: {
      name: 'Demo Client 3'
    },
    uploader: 'Demo User 3',
    created: '2020-01-01 00:00:00'
  }
]

const TableData = () => {
  return (
    <Table className='file-uploads-table'>
      {datas.map(data => {
        return (
          <Row key={data.id}>
            <Column className='file-icon flex-none'>
              <Icon className='fal fa-file-alt' />
            </Column>
            <Column
              className='bold'
              label='Group Name'
            >
              <Link to={`/admin/file-upload/${data.id}`}>
                {data.name}
              </Link>
            </Column>
            <Column
              label='Client'
              value={data.client.name}
            />
            <Column
              label='Uploader'
              value={data.uploader}
            />
            <Column
              className='flex-none'
              label='Created'
              value={data.created}
            />
            <Column className='action'>
              <Link
                className='blue'
                to={`/admin/data-groups/edit/${data.id}`}
              >
                <Icon className='fal fa-pencil-alt' />
              </Link>
              <Link
                className='red'
                to={`/admin/data-groups/delete/${data.id}`}
              >
                <Icon className='fal fa-trash' />
              </Link>
            </Column>
          </Row>
        )
      })}
    </Table>
  )
}

export default TableData
