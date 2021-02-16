import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Icon } from '@lib'

const Page = ({ active, page, onClick, children }) => {
  return (
    <div className={classNames('page', { active })}>
      <a
        className={classNames('page-num')}
        onClick={() => onClick(page)}
      >
        {children || page }
      </a>
    </div>
  )
}

Page.propTypes = {
  active: PropTypes.bool,
  page: PropTypes.number,
  onClick: PropTypes.func,
  children: PropTypes.node
}

Page.defaultProps = {
  active: false,
  children: null
}

const Pagination = (props) => {
  const {
    currentPage, pages, limit, sizes, selectedSize,
    onPageClick, onSizeChange, className
  } = props

  const showedPages = []
  const pageAgg = Math.floor((currentPage - 1) / limit)
  const startPage = (pageAgg * limit) + 1
  const endPage = (startPage + (limit - 1)) > pages ? pages : (startPage + (limit - 1))

  for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
    showedPages.push(
      <Page
        key={`page.${pageNum}`}
        active={pageNum === currentPage}
        page={pageNum}
        onClick={() => onPageClick(pageNum)}
      />
    )
  }

  const handleOnPrevious = () => {
    if (currentPage - 1 > 0) {
      onPageClick(currentPage - 1)
    }
  }

  const handleOnNext = () => {
    if (currentPage + 1 <= pages) {
      onPageClick(currentPage + 1)
    }
  }

  return (
    <div className={classNames('pagination', className)}>
      <div className='pages'>
        <Page onClick={() => onPageClick(1)}>
          <Icon className='fal fa-angle-double-left' />
        </Page>

        <Page onClick={handleOnPrevious}>
          <Icon className='fal fa-angle-left' />
        </Page>

        {showedPages}

        <Page onClick={handleOnNext}>
          <Icon className='fal fa-angle-right' />
        </Page>

        <Page onClick={() => onPageClick(pages)}>
          <Icon className='fal fa-angle-double-right' />
        </Page>

        <div className='sizer'>
          <select
            value={selectedSize}
            onChange={(e) => onSizeChange(parseInt(e.target.value))}
          >
            {sizes.map(size => (
              <option key={size}>{size}</option>
            ))}
          </select>
          <span>per page</span>
        </div>
      </div>
    </div>
  )
}

Pagination.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  sizes: PropTypes.arrayOf(PropTypes.number),
  selectedSize: PropTypes.number,
  onPageClick: PropTypes.func,
  onSizeChange: PropTypes.func
}

Pagination.defaultProps = {
  onPageClick: () => {},
  onFirst: () => {},
  onPrevious: () => {},
  onNext: () => {},
  onLast: () => {},
  onSizeChange: () => {}

}

export default Pagination
