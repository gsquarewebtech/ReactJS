import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Icon from '../Icon'
import ClickOutside from '../ClickOutside'

const Modal = ({ show, className, children, onClose }) => {
  const handleClose = () => {
    onClose()
  }

  return (
    <div className={classNames('modal-backdrop', { show })}>
      <ClickOutside onClick={handleClose}>
        <div className={classNames('modal', className)}>
          <Icon
            className='modal-close fal fa-times'
            onClick={handleClose}
          />
          {children}
        </div>
      </ClickOutside>
    </div>
  )
}

Modal.propTypes = {
  show: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func
}

Modal.defaultProps = {
  show: false,
  onClose: () => {}
}

export default Modal
