import { t } from "i18next";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import { useEffect, useState } from "react";
import { getAllInvoices, getFilteredInvoices } from "../../services/api";
import {
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
  Button,
  Input,
  Select,
  Option,
  IconButton,
  Breadcrumbs,
} from "@material-tailwind/react";
import "./style.scss";
import Loader from "../../components/Loader/Loader";
import { Link } from "react-router-dom";

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllInvoices(page, 5); 
        setInvoices(data.results);
        setTotalPages(data.totalPages);
        // console.log("Total Pages :", data.totalPages);
        console.log("Fetched invoices:", data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]); 

  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  const handleSearchChange = (e) => {
    setFilterValue(e.target.value);
  };

  const handleFilterSubmit = async () => {
    setOpen(false);
    try {
      const data = await getFilteredInvoices(filterType, filterValue);
      setInvoices(data.results);
      console.log("Filtered invoices:", data.results);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  const next = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prev = () => {
    if (page > 1) setPage(page - 1);
  };

  const getItemProps = (index) => ({
    variant: page === index + 1 ? "filled" : "text",
    onClick: () => setPage(index + 1),
  });


  return (
    <div className="AllInvoices">
      <h1 className="Title">{t("invoices")}</h1>
      <ContentWrapper>
        <div className="Header shadow-md rounded-md p-2 flex justify-between items-center text-right">
          <div className="Breadcrumb">
            <Breadcrumbs>
              <Link
                to={"/"}
                className="opacity-60 text-black text-base font-bold"
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
              <Link to={"/AllInvoices"} className="  text-base font-bold">
                <span>{t("invoices")}</span>
              </Link>
            </Breadcrumbs>
          </div>
          <div className="Filter">
            <h6>
              <button
                onClick={handleOpen}
                className="right-0 font-medium text-base flex gap-1 items-center cursor-pointer"
              >
                <span>
                  <AdjustmentsHorizontalIcon />
                </span>
                {t("filter")}
              </button>
            </h6>
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
                    onChange={(e) => handleFilterChange(e.target.value)}
                  >
                    <Option value="pharmacy">{t("pharmacy")}</Option>
                    <Option value="driver">{t("driver")}</Option>
                    <Option value="rep">{t("medicalRep")}</Option>
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
                    onChange={(e) => handleSearchChange(e)}
                  />
                </div>
              </DialogBody>
              <DialogFooter className="space-x-2">
                <Button
                  variant="text"
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
        ) : (
          <div className="content">
            {invoices.length > 0 ? (
              <>
                {invoices.map((invoice) => (
                  <Link
                    key={invoice._id}
                    to={`/invoice/${invoice._id}`}
                    className="InvoiceItem shadow-md p-2 m-2 flex items-center gap-3 rounded-3xl"
                  >
                    <div className="logo">
                      <span>
                        <BanknotesIcon className="w-20 h-20 text-white" />
                      </span>
                    </div>
                    <div>
                      <p className="text-white">
                        <span className="font-bold text-base">
                          {t("amount")}:
                        </span>{" "}
                        {invoice.amount}
                      </p>
                      <p className="text-white">
                        <span className="font-bold text-base">
                          {t("orderStatus")}:
                        </span>{" "}
                        {invoice.orderStatus}
                      </p>
                      <p className="text-white">
                        <span className="font-bold text-base">
                          {t("type")}:
                        </span>
                        {invoice.invoiceType}
                      </p>
                      <p className="text-white">
                        <span className="font-bold text-base">
                          {t("status")}:
                        </span>
                        {invoice.invoiceStatus}
                      </p>
                    </div>
                  </Link>
                ))}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="text"
                    className="flex items-center gap-2 text-black"
                    onClick={prev}
                    disabled={page === 1}
                  >
                    <ArrowLeftIcon
                      strokeWidth={2}
                      className="h-4 w-4 text-black rtl:rotate-180"
                    />{" "}
                    {t("previous")}
                  </Button>
                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, index) => (
                      <IconButton className="ActivePaginate" key={index} {...getItemProps(index)}>
                        {index + 1}
                      </IconButton>
                    ))}
                  </div>
                  <Button
                    variant="text"
                    className="flex items-center gap-2 text-black"
                    onClick={next}
                    disabled={page === totalPages}
                  >
                    {t("next")}{" "}
                    <ArrowRightIcon
                      strokeWidth={2}
                      className="h-4 w-4 text-black rtl:rotate-180"
                    />
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-gray-500">{t("noData")}</p>
            )}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default AllInvoices;
