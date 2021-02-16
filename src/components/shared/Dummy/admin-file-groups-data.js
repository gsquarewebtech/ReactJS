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
    group: 'rates',
    name: 'Rates',
    files: 27
  },
  {
    id: 2,
    group: 'claims',
    name: 'Claims',
    files: 47
  },
  {
    id: 3,
    group: 'questionnaires',
    name: 'Questionnaires',
    files: 67
  }
]

const TableData = () => {
  return (
    <Table className='file-groups-table'>
      {datas.map(data => {
        return (
          <Row key={data.id}>
            <Column className='folder-icon flex-none'>
              <Icon className='fal fa-folder' />
            </Column>
            <Column
              className='bold'
              label='Group Name'
            >
              <Link to={`/admin/data-logic/file-group/${data.group}`}>
                {data.name}
              </Link>
            </Column>
            <Column
              className='flex-none'
              label='Files'
              value={data.files}
            />
          </Row>
        )
      })}
    </Table>
  )
}

export default TableData
