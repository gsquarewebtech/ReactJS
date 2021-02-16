import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

const Icon = ({ className, tooltipId, tooltip, onClick }) => {
  const handleClick = () => {
    onClick()
  }

  return (
    <Fragment>
      <i
        className={className}
        data-for={tooltipId}
        data-tip={tooltip}
        onClick={handleClick}
      />
      <ReactTooltip
        id={tooltipId}
        type='light'
        border={true}
        borderColor='#000000'
      />
    </Fragment>
  )
}

Icon.propTypes = {
  className: PropTypes.string,
  tooltipId: PropTypes.string,
  tooltip: PropTypes.string,
  onClick: PropTypes.func
}

Icon.defaultProps = {
  onClick: () => {}
}

export default Icon
