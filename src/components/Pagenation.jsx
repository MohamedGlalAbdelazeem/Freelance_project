import React from 'react'
import ReactPaginate from 'react-paginate';
function Pagenation() {

    const handlePageClick = () => {
        console.log("test")
    }
    const pageCount = 12;
  return (
    <div>
        <ReactPaginate
        breakLabel="..."
        nextLabel="التالي "
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="السابق"
         
      />
    </div>
  )
}

export default Pagenation