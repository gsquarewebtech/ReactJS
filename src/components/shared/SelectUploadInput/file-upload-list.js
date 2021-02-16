import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useQuery } from '@apollo/client'

import { Icon } from '@lib'
import excelFilesGql from '@graphql/queries/excel-files'

const FileUploadList = ({ group, accountId, selected, status, onSelect }) => {
  const excelFilesQuery = useQuery(excelFilesGql, {
    variables: {
      group,
      accountId,
      status
    }
  })

  if (excelFilesQuery.loading) {
    return null
  }

  const { excelFiles } = excelFilesQuery.data

  return (
    <div className='file-upload-list-selector'>
      {excelFiles.map(excelFile => (
        <div
          className={classNames('file-upload-item', { selected: excelFile.id === selected.id })}
          key={excelFile.id}
          onClick={() => onSelect(excelFile)}
        >
          <Icon
            className='fal fa-check-circle'
          />
          <span className='file-name'>
            {excelFile.upload.name}
          </span>
        </div>
      ))}
    </div>
  )
}

FileUploadList.propTypes = {
  group: PropTypes.string,
  accountId: PropTypes.string,
  selected: PropTypes.object,
  status: PropTypes.string,
  onSelect: PropTypes.func
}

FileUploadList.defaultProps = {
  group: null,
  accountId: null,
  selected: {},
  status: 'done',
  onSelect: () => {}
}

export default FileUploadList
