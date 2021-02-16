import React, { useEffect, useRef, cloneElement } from 'react'
import PropTypes from 'prop-types'

const ClickOutside = ({ children, onClick }) => {
  const ref = useRef()
  useEffect(() => {
    if (!ref?.current) {
      return
    }
    const handleClickOutside = (e) => {
      if (onClick && !ref.current.contains(e.target)) {
        onClick(e)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClick])
  return <>{cloneElement(children, { ref })}</>
}

ClickOutside.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func
}

ClickOutside.defaultProps = {
  onClick: () => {}
}

export default ClickOutside
