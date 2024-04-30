import React from 'react'
import ReactPaginate from 'react-paginate';
function Pagenation() {

    const handlePageClick = (data) => {
        console.log(data.selected + 1);
    }
    const pageCount = 15;
  return (
    <div className='mt-10'>
      <ReactPaginate
          breakLabel="..."
          nextLabel="التالي"
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="السابق"
          pageLinkClassName=''
          containerClassName="pagination flex justify-center text-xl"
          pageClassName="px-6 py-2 mx-1 border rounded hover:bg-gray-200"
          activeClassName="bg-blue-500 text-white"
          previousClassName="px-3 py-1 mx-1 border rounded hover:bg-gray-200"
          nextClassName="px-6 py-1 mx-1 border rounded hover:bg-gray-200"
      />
    </div>
  )
}

export default Pagenation