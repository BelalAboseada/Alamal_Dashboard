import { t } from "i18next";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import {
  Breadcrumbs,
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import usePagination from "../../hooks/UsePagination";
import { getAllVisits, getFilteredVisits } from "../../services/api";
import Pagination from "../../components/Pagination/Pagination";
import Loader from "../../components/Loader/Loader";

const AllVisits = () => {
  const [Visits, setVisits] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const { page, nextPage, prevPage, goToPage, totalPages, updateTotalPages } =
    usePagination(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllVisits(page);
        setVisits(data.results);
        updateTotalPages(data.count);
        console.log("Fetched invoices:", data.results);
        console.log("Total Pages:", totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleOpen = () => setOpen(!open);
  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  const handleSearchChange = (e) => {
    setFilterValue(e.target.value);
  };
  const handleFilterSubmit = async () => {
    setOpen(false);
    try {
      const data = await getFilteredVisits(filterType, filterValue);
      setVisits(data.results);
      updateTotalPages(data.count, data.results.length);
      console.log("Filtered Visits:", data.results);
      console.log("Total Pages:", totalPages);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };
  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      handleFilterSubmit();
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "q") {
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const TABLE_HEAD = [
    { label: t("type"), key: "type" },
    { label: t("status"), key: "status" },
    { label: t("hasPayment"), key: "hasPayment" },
    { label: t("location"), key: "location" },
    { label: t("comment"), key: "comment" },
  ];

  return (
    <div className="AllVisits">
      <h1 className="Title">{t("visits")}</h1>
      <ContentWrapper>
        <div className="Header shadow-md rounded-md p-2 flex justify-between items-center text-right">
          <div className="Breadcrumb">
            <Breadcrumbs>
              <Link
                to={"/"}
                className="opacity-60 text-black  text-sm font-medium  lg:text-base mx-1 lg:font-extrabold "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </Link>
              <Link
                to={"/AllVisits"}
                className=" text-sm font-medium  lg:text-base mx-1 lg:font-extrabold "
              >
                <span>{t("visits")}</span>
              </Link>
            </Breadcrumbs>
          </div>
          <div className="Filter">
            <Tooltip
              className="bg-gray-100 text-blue-400 "
              content="ctrl + Q for Quick open"
              placement="top"
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 },
              }}
            >
              <h6>
                <button
                  onClick={handleOpen}
                  className="right-0 font-medium text-base mx-1 flex gap-1 items-center cursor-pointer"
                >
                  <span>
                    <AdjustmentsHorizontalIcon />
                  </span>
                  {t("filter")}
                </button>
              </h6>
            </Tooltip>
            <Dialog open={open} size="xs" handler={handleOpen}>
              <div className="flex items-center justify-between">
                <DialogHeader className="flex flex-col items-start">
                  <Typography className="mb-1" variant="h4">
                    {t("filter")}
                  </Typography>
                </DialogHeader>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="m-3 cursor-pointer h-5 w-5"
                  onClick={handleOpen}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <DialogBody>
                <div className="grid gap-6">
                  <label
                    htmlFor="SelectFilter"
                    className="block text-sm font-medium leading-6"
                  >
                    {t("selectFilter")}
                  </label>
                  <Select
                    variant="standard"
                    placeholder={t("selectPharmacy")}
                    id="SelectFilter"
                    className="select w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                    required
                    onChange={(e) => handleFilterChange(e)}
                  >
                    <Option value="pharmacy">{t("pharmacy")}</Option>
                    <Option value="company">{t("companyName")}</Option>
                    <Option value="medicalRep">{t("medicalRep")}</Option>
                    <Option value="createdBy">{t("createdBy")}</Option>
                    <Option value="date">{t("date")}</Option>
                  </Select>
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium leading-6"
                  >
                    {t("search")}
                  </label>
                  <Input
                    id="search"
                    variant="standard"
                    className="Input w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                    placeholder={t("search")}
                    onKeyUp={handleKeyUp}
                    onChange={(e) => handleSearchChange(e)}
                  />
                </div>
              </DialogBody>
              <DialogFooter className="space-x-2">
                <Button
                  variant="text"
                  ripple={false}
                  color="gray"
                  onClick={() => {
                    setFilterType("");
                    setFilterValue("");
                    setOpen(false);
                  }}
                >
                  {t("clear")}
                </Button>
                <Button
                  variant="gradient"
                  ripple={false}
                  color="blue"
                  onClick={handleFilterSubmit}
                >
                  {t("submit")}
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center mt-5">
            <Loader />
          </div>
        ) : Visits.length === 0 ? (
          <div className="flex items-center justify-center mt-5">
            <Typography>{t("noData")}</Typography>
          </div>
        ) : (
          <div className="overflow-x-auto mt-5">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-xs md:text-sm lg:text-base">
                  {TABLE_HEAD.map((item, index) => (
                    <th key={index} className="p-2 md:p-4 text-left">
                      {item.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Visits.map((visit, index) => (
                  <tr
                    key={index}
                    className="bo border-b border-gray-200 hover:bg-gray-50 text-xs md:text-sm lg:text-base"
                  >
                    {TABLE_HEAD.map((item, headIndex) => (
                      <td key={headIndex} className="p-2 md:p-4 text-left">
                        <Link to={"/ArrangeVisits"}>
                          {item.key === "hasPayment" ? (
                            <Chip
                              size="sm"
                              className="w-fit mx-auto ml-5"
                              variant="ghost"
                              value={visit[item.key]?.toString() || "N/A"}
                              color={visit[item.key] ? "green" : "red"}
                            />
                          ) : (
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {visit[item.key] || "N/A"}
                            </Typography>
                          )}
                        </Link>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ContentWrapper>
      <div className="flex items-center justify-center gap-4 mt-3">
        <Pagination
          page={page}
          totalPages={totalPages}
          nextPage={nextPage}
          prevPage={prevPage}
          goToPage={goToPage}
        />
      </div>
    </div>
  );
};

export default AllVisits;
