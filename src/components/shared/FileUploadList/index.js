import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import classNames from 'classnames'

import { Button, Badge, swal, Pagination, Icon } from '@lib'
import { Link } from '@shared'
import { ListView, Item, Field } from '@shared/ListView'
import { Errors } from '@shared/Error'
import config from '@config'

import fileUploadsGql from '@graphql/queries/excel-files'
import destroyFileUpload from '@graphql/mutators/destroy-excel-file'

const excelStatusColor = {
  processing: 'blue',
  resolve: 'orange',
  error: 'red',
  done: 'green'
}

const FileUploadList = ({ group, accountId, itemClass, links, fields, actions, onDelete, filters }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showedFileCount, setShowedFileCount] = useState(5)

  // set search
  const variables = { group, accountId, status }

  if (filters.search) {
    variables.search = filters.search
  }

  if (filters.status) {
    variables.status = filters.status
  }

  const fileUploadsQuery = useQuery(fileUploadsGql, { variables, fetchPolicy: 'network-only' })

  if (fileUploadsQuery.loading) {
    return null
  }

  const { excelFiles } = fileUploadsQuery.data

  // pagination
  const filesLength = excelFiles.length
  const pages = Math.ceil(filesLength / showedFileCount)

  const currentFiles = []
  const startFileIndex = (currentPage - 1) * showedFileCount
  let endFileIndex = startFileIndex + (showedFileCount - 1)
  if (endFileIndex > (filesLength - 1)) {
    endFileIndex = filesLength - 1
  }

  for (let i = startFileIndex; i <= endFileIndex; i++) {
    const file = excelFiles[i]
    currentFiles.push(
      file
    )
  }

  const handlePageClick = (page) => {
    setCurrentPage(page)
  }

  const handlePaginationSizeChange = (size) => {
    setCurrentPage(1)
    setShowedFileCount(size)
  }
  // end

  const handleDelete = (fileUpload) => {
    swal({
      text: 'Are you sure you want to delete this file upload?',
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
        destroyFileUpload({ id: fileUpload.id, group, accountId }).then(({ data, extensions }) => {
          if (data.destroyExcelFile) {
            swal({
              text: 'File upload deleted!',
              icon: 'success',
              buttons: false,
              timer: 1500
            })
          }

          if (extensions && extensions.errors) {
            swal({
              title: 'Failed',
              icon: 'error',
              buttons: false,
              timer: 2500,
              content: (
                <Errors errors={extensions.errors} />
              )
            })
          }
        })
      }
    })
  }

  const token = localStorage.authToken

  return (
    <ListView>
      {currentFiles.map(fileUpload => (
        <Item
          key={fileUpload.id}
          className={itemClass}
        >
          {fields.id && (
            <Field label='ID' value={fileUpload.id.padStart(6, '0')} className={classNames('flex-none', 'width-120')}/>
          )}

          {fields.name && (
            <Field label='Name'>
              <Link to={`${links.view}/${fileUpload.id}`}>
                {fileUpload?.upload?.name}
              </Link>
            </Field>
          )}

          {fields.account && (
            <Field
              label='Client'
              value={fileUpload?.account?.name}
            />
          )}

          {fields.status && (
            <Field label='Status' className={classNames('center', 'flex-none', 'width-200')}>
              <Badge className={classNames('circle', 'capitalize', excelStatusColor[fileUpload.status])}>{fileUpload.status}</Badge>
            </Field>
          )}

          {fields.actions && (
            <Field className={classNames('item-action', 'width-180', 'right')} noLabel>
              {actions.newRequest && (
                <Link
                  className='button blue circle with-text'
                  text='Select'
                  to={`${links.newRequest}/${fileUpload.id}/request/new`}
                />
              )}

              {actions.delete && fileUpload.status === 'resolve' && (
                <Link className='button blue circle with-text' text='Resolve' to={`/client/data-logic/file-group/${group}/${fileUpload.id}/resolver`} />
              )}

              {actions.delete && fileUpload.status === 'error' && (
                <a
                  className='button small blue'
                  href={`${config.API_URL}/view-file-errors/${token}/${fileUpload.id}`}
                >
                  <Icon className='fal fa-exclamation' />
                </a>
              )}

              {actions.delete && (
                <Button className='red' onClick={() => handleDelete(fileUpload)} icon='fal fa-trash' />
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
        selectedSize={showedFileCount}
        onSizeChange={handlePaginationSizeChange}
      />
    </ListView>
  )
}

FileUploadList.propTypes = {
  group: PropTypes.string,
  accountId: PropTypes.string,
  itemClass: PropTypes.string,
  links: PropTypes.object,
  fields: PropTypes.object,
  actions: PropTypes.object,
  onDelete: PropTypes.func,
  filters: PropTypes.object
}

FileUploadList.defaultProps = {
  group: null,
  accountId: null,
  links: {
    view: '',
    newRequest: ''
  },
  fields: {
    id: true,
    name: true,
    account: false,
    actions: true
  },
  actions: {
    delete: true,
    newRequest: false
  },
  onDelete: () => {},
  filters: {}
}

export default FileUploadList
