import React from 'react'
import PropTypes from 'prop-types'

const Board = ({ children }) => {
  return (
    <div className='board'>
      {children}
    </div>
  )
}

Board.propTypes = {
  children: PropTypes.node
}

Board.defaultProps = {
  board: null
}

export default Board
