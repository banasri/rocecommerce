import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pagesToShow = 7; // Number of pages to show (adjust as needed)
  
  // Helper function to generate page numbers
  const generatePageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    if (endPage - startPage < pagesToShow - 1) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex items-center justify-center mt-4">
      <nav className="inline-flex">
        {/* First Page and Previous Page Buttons */}
        <button
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          className={`px-2 py-1 ${
            isFirstPage ? 'text-gray-500 cursor-not-allowed' : 'text-black-500 hover:text-black-700 cursor-pointer'
          }`}
        >
          {"<< "}
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={`px-2 py-1 ${
            isFirstPage ? 'text-gray-500 cursor-not-allowed' : 'text-black-500 hover:text-black-700 cursor-pointer'
          }`}
        >
          {"<"}
        </button>

        {/* Page Numbers */}
        {generatePageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-2 py-1 ${
              page === currentPage ? 'text-black-500 hover:text-black-700 font-bold' : 'text-black-500 hover:text-black-700'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Page and Last Page Buttons */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className={`px-2 py-1 ${
            isLastPage ? 'text-gray-500 cursor-not-allowed' : 'text-black-500 hover:text-black-700 cursor-pointer'
          }`}
        >
          {">"}
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
          className={`px-2 py-1 ${
            isLastPage ? 'text-gray-500 cursor-not-allowed' : 'text-black-500 hover:text-black-700 cursor-pointer'
          }`}
        >
          {">> "}
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
