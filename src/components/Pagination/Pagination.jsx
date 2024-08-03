import { IconButton, Button } from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { t } from "i18next";

const Pagination = ({ page, totalPages, nextPage, prevPage, goToPage }) => {
  const getPageItems = () => {
    const visiblePages = 3; 
    const items = [];


    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(renderPageButton(i));
      }
    } else {
  
      const halfVisiblePages = Math.floor(visiblePages / 2);
      let startPage = Math.max(1, page - halfVisiblePages);
      let endPage = Math.min(totalPages, startPage + visiblePages - 1);

      if (endPage - startPage + 1 < visiblePages) {
        startPage = Math.max(1, endPage - visiblePages + 1);
      }

      if (startPage > 1) {
        items.push(renderPageButton(1));
        if (startPage > 2) {
          items.push(renderEllipsis());
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(renderPageButton(i));
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          items.push(renderEllipsis());
        }
        items.push(renderPageButton(totalPages));
      }
    }

    return items;
  };

  const renderPageButton = (pageNumber) => (
    <IconButton
      className={pageNumber === page ? "ActivePaginate" : ""}
      key={pageNumber}
      ripple={false}
      variant={pageNumber === page ? "filled" : "text"}
      onClick={() => goToPage(pageNumber)}
    >
      {pageNumber}
    </IconButton>
  );

  const renderEllipsis = () => (
    <span key="ellipsis" className="PaginationEllipsis">
      ...
    </span>
  );

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="text"
        ripple={false}
        className="flex items-center gap-1 text-black"
        onClick={prevPage}
        disabled={page === 1}
      >
        <ArrowLeftIcon
          strokeWidth={2}
          className="h-4 w-4 text-black rtl:rotate-180"
        />{" "}
        {t("previous")}
      </Button>
      <div className="flex items-center gap-1">{getPageItems()}</div>
      <Button
        variant="text"
        ripple={false}
        className="flex items-center gap-1 text-black"
        onClick={nextPage}
        disabled={page === totalPages}
      >
        {t("next")}
        <ArrowRightIcon
          strokeWidth={2}
          className="h-4 w-4 text-black rtl:rotate-180"
        />
      </Button>
    </div>
  );
};

export default Pagination;
