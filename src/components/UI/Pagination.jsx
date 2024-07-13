import { Button } from "@material-tailwind/react";

const Pagination = ({ nPages, currentPage, setCurrentPage }) => {
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  const goToNextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

  return (
    <nav className="mt-4 flex justify-center">
      <ul className="pagination">
        <li className="page-item">
          <Button
            color="gray"
            buttonType="link"
            size="lg"
            rounded={false}
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
        </li>
        {pageNumbers.map((pgNumber) => (
          <li
            key={pgNumber}
            className={`page-item ${currentPage === pgNumber ? "active" : ""}`}
          >
            <Button
              color="blue"
              buttonType="link"
              size="lg"
              rounded={false}
              onClick={() => setCurrentPage(pgNumber)}
            >
              {pgNumber}
            </Button>
          </li>
        ))}
        <li className="page-item">
          <Button
            color="gray"
            buttonType="link"
            size="lg"
            rounded={false}
            onClick={goToNextPage}
            disabled={currentPage === nPages}
          >
            Next
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
