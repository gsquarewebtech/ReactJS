import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Modal from '@lib/Modal'
import FileUploadList from './file-upload-list'

const groupNames = {
  claims: 'Claim Files',
  questionnaires: 'Questionnaire Files',
  rates: 'Rate Files',
  specialty: 'Specialty Files'
}

const SelectUploadInput = ({
  label,
  placeholders,
  value,
  group,
  accountId,
  onChange,
  errors
}) => {
  const [showModal, setShowModal] = useState(false)

  const handleFileInputChange = (evt) => {
    if (evt.target.files.length === 1) {
      const file = evt.target.files[0]
      onChange(file)
    }
  }

  const handleOnSelect = (file) => {
    onChange(file)
    setShowModal(false)
  }

  let inputType = null
  let fileUpload = {}

  if (value && value.constructor === File) {
    inputType = 'file'
  } else if (value && value.id) {
    inputType = 'fileUpload'
    fileUpload = value
  }

  return (
    <Fragment>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className='header'>
          {groupNames[group]}
        </div>
        <div className='content'>
          <FileUploadList
            group={group}
            accountId={accountId}
            onSelect={handleOnSelect}
            selected={fileUpload}
          />
        </div>
      </Modal>

      <div className='select-upload-input'>
        <div className='select-upload-label'>
          {label}
        </div>
        <div className={classNames('select-upload', { 'has-error': !!errors.length })}>
          <div className='upload-input'>
            <span className='file-label'>
              {value && inputType === 'file' && value.name}
              {value && inputType === 'fileUpload' && value.upload.name}
              {!value && placeholders.file}
            </span>
            <div
              className="input"
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

SelectUploadInput.propTypes = {
  label: PropTypes.string,
  placeholders: PropTypes.object,
  value: PropTypes.any,
  group: PropTypes.string,
  accountId: PropTypes.string,
  errors: PropTypes.array,
  onChange: PropTypes.func
}

SelectUploadInput.defaultProps = {
  label: '',
  placeholders: {
    select: 'Select from DataLogic'
  },
  group: null,
  accountId: null,
  errors: [],
  onChange: () => {}
}

export default SelectUploadInput
