import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useQuery } from '@apollo/client'
import fetchProgress from 'fetch-progress'

import { Button, Card } from '@lib'
import { Form, Group, Input, Submit, FormError } from '@shared/Form'
import { Table, Head, Body, Row, Column } from '@shared/Table'
import { post } from '@utils'

import clientsGql from '@graphql/queries/clients'

// TODO: add support for other account type upload

const FileUploadForm = ({ group, fields, onSuccess }) => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processing] = useState(false)
  const [input, setInput] = useState({
    accountId: '',
    group,
    file: null
  })
  const [inputErrors] = useState({})

  const [table] = useState({ show: false, headers: [], rows: [], errors: [] })

  const clientsQuery = useQuery(clientsGql)
  if (clientsQuery.loading) {
    return null
  }

  // const getErrors = () => {
  //   const errors = {}

  //   if (fields.account && !input.accountId) {
  //     errors.accountId = [{
  //       message: 'client is required'
  //     }]
  //   }

  //   if (!input.file) {
  //     errors.file = [{
  //       message: 'file is required'
  //     }]
  //   }

  //   return errors
  // }

  const handleInputChange = (name, value) => {
    const newInput = { ...input }
    newInput[name] = value
    setInput(newInput)
  }

  const handleUpload = (evt) => {
    if (evt) {
      evt.preventDefault()
    }

    const body = new FormData()
    body.append('accountId', input.accountId)
    body.append('group', input.group)
    body.append('excel', input.file)

    post('upload', body, { customBody: true, headers: {} }).then(
      fetchProgress({
        onProgress (progress) {
          setUploadProgress(progress.percentage)
        }
      })
    ).then(response => {
      response.json().then(json => {
        onSuccess(json)
      })
    })

    // const feErrors = getErrors()

    // if (!object.keys(feErrors).length) {
    //   setProcessing(true)

    //   const fileUploadInput = {
    //     file: input.file,
    //     group
    //   }

    //   if (fields.account) {
    //     fileUploadInput.accountId = input.accountId
    //   }

    //   createFileUpload(fileUploadInput).then(({ data, extensions }) => {
    //     const { ok, excel } = data.createFileUpload
    //     if (ok) {
    //       setProcessing(false)
    //       onSuccess()
    //     } else if (extensions?.errors) {
    //       const beErrors = array.groupBy(extensions.errors, 'path')
    //       const rowErrors = beErrors.rowError
    //       delete beErrors.rowError
    //       beErrors.fileValidation = [{ message: 'invalid file format' }]
    //       setProcessing(false)
    //       setInputErrors(beErrors)
    //       setTable({
    //         show: true,
    //         headers: excel.headers,
    //         rows: excel.rows,
    //         errorsIndex: rowErrors.map(error => error.index)
    //       })
    //     }
    //   })
    // } else {
    //   setInputErrors(feErrors)
    // }
  }

  const accounts = clientsQuery.data.clients

  return (
    <Fragment>
      <Card>
        <Form onSubmit={handleUpload}>
          <FormError errors={inputErrors} />

          {fields.account && (
            <Group>
              <Input
                label='Client'
                type='select'
                placeholder='Select Client'
                options={accounts.map(o => ({ value: o.id, text: o.name }))}
                value={input.accountId}
                onChange={(value) => handleInputChange('accountId', value)}
                errors={inputErrors.accountId}
              />
            </Group>
          )}

          <Group>
            <Input
              label='File'
              type='file'
              placeholder='Choose a File ...'
              value={input.file}
              onChange={(value) => handleInputChange('file', value)}
              errors={inputErrors.file}
            />
            <div className='upload-progress'>
              <div
                className='progress'
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </Group>

          <Submit className='right'>
            <Button
              type='submit'
              className='circle icon-left'
              icon='fal fa-upload'
              text='Upload'
              loading={processing}
            />
          </Submit>
        </Form>
      </Card>

      {table.show && (
        <Card>
          <h3>Uploaded File Preview</h3>
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
                <Row
                  key={rowIndex}
                  className={classNames({ 'has-error': table.errorsIndex.includes(rowIndex) })}
                >
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
      )}

    </Fragment>
  )
}

FileUploadForm.propTypes = {
  group: PropTypes.string,
  fields: PropTypes.object,
  onSuccess: PropTypes.func
}

FileUploadForm.defaultProps = {
  fields: {
    account: false
  },
  onSuccess: () => {}
}

export default FileUploadForm
