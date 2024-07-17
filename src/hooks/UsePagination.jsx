import { useState } from "react";

 const usePagination = (initialPage = 1, itemsPerPage = 10) => {
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const nextPage = () => setPage((prevPage) => prevPage + 1);
  const prevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));

  const goToPage = (pageNumber) => {
    const pageNum = Math.max(1, Math.min(pageNumber, totalPages));
    setPage(pageNum);
  };

  const updateTotalPages = (totalCount) => {
    const calculatedTotalPages = Math.ceil(totalCount / itemsPerPage);
    setTotalPages(calculatedTotalPages);
  };

  return {
    page,
    nextPage,
    prevPage,
    goToPage,
    totalPages,
    updateTotalPages,
  };
};
export default usePagination;
