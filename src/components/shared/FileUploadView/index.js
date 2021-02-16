import React from 'react'
import PropTypes from 'prop-types'

import { Card } from '@lib'
import { Table, Head, Body, Row, Column } from '@shared/Table'

const FileUploadView = ({ table }) => {
  return (
    <Card>
      <Table>
        <Head>
          <Row>
            {table.headers.map(header => (
              <Column
                key={`column-${header.name}`}
                value={header.name}
              />
            ))}
          </Row>
        </Head>

        <Body>
          {table.rows.map((row, rowIndex) => (
            <Row key={rowIndex}>
              {table.headers.map(header => (
                <Column
                  key={`${rowIndex}-${header.name}`}
                  value={row[header.name]}
                />
              ))}
            </Row>
          ))}
        </Body>
      </Table>
    </Card>
  )
}

FileUploadView.propTypes = {
  table: PropTypes.object
}

FileUploadView.defaultProps = {
  table: {
    headers: [],
    rows: []
  }
}

export default FileUploadView
