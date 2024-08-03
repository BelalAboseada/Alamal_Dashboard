import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import {  getFilteredPaymentsByInvoice, getPaymentsByInvoice } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { t } from "i18next";
import "./style.scss";
import {  Breadcrumbs,
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import usePagination from "../../hooks/UsePagination";
import Pagination from "../../components/Pagination/Pagination";

const PaymentsByInvoice = () => {
  const { id } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const { page, nextPage, prevPage, goToPage, totalPages, updateTotalPages } =
    usePagination(1);

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPaymentsByInvoice(id);
        setPayments(data.results);
        console.log("Fetched payments:", data.results);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [id]);

 const handleFilterChange = (value) => {
   setFilterType(value);
 };

 const handleSearchChange = (e) => {
   setFilterValue(e.target.value);
 };
  const handleFilterSubmit = async () => {
    setOpen(false);
    try {
      const data = await getFilteredPaymentsByInvoice(filterType, filterValue,id );
      setPayments(data.results);
      updateTotalPages(data.count, data.results.length);
      console.log("Filtered payments:", data.results);
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
     { label: t("amount"), key: "amount" },
     { label: t("status"), key: "status" },
     { label: t("createdBy"), key: "createdBy" },
     { label: t("date"), key: "paymentDate" },
   ];
  return (
    <div className="PaymentForInvoice">
      <ContentWrapper>
        <div className="Header shadow-md rounded-md p-2 flex justify-between items-center text-right">
          <div className="Breadcrumb">
            <Breadcrumbs>
              <Link
                to={"/"}
                className="opacity-60 text-black text-xs font-bold"
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
                to="/AllInvoices"
                className="text-xs font-normal lg:text-base lg:font-extrabold"
              >
                <span>{t("invoices")}</span>
              </Link>
              <Link
                to={`/invoice/${id}`}
                className="text-xs font-normal lg:text-base lg:font-extrabold"
              >
                <span>{t("invoice")}</span>
              </Link>
              <Link
                to={`/payment/invoice/${id}`}
                className="text-xs font-normal lg:text-base lg:font-extrabold"
              >
                <span>{t("paymentForInvoice")}</span>
              </Link>
            </Breadcrumbs>
          </div>
          <div className="Filter">
            <h6>
              <button
                onClick={handleOpen}
                className="right-0 font-medium text-sm flex  items-center cursor-pointer"
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
                    onChange={handleSearchChange}
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
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto  mt-5">
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
                {payments.map((Payment, index) => (
                  <tr
                    key={index}
                    className="bo border-b border-gray-200 hover:bg-gray-50 text-xs md:text-sm lg:text-base"
                  >
                    {TABLE_HEAD.map((item, headIndex) => (
                      <td key={headIndex} className="p-2 md:p-4 text-left">
                        <Link>
                          {item.key === "status" ? (
                            <Chip
                              size="sm"
                              className="w-fit mx-auto ml-5"
                              variant="ghost"
                              value={Payment[item.key].toString() || "N/A"}
                              color={Payment[item.key] ? "green" : "red"}
                            />
                          ) : (
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium"
                            >
                              {item.key === "paymentDate"
                                ? new Date(
                                    Payment[item.key]
                                  ).toLocaleDateString() || "N/A"
                                : item.key === "createdBy"
                                ? Payment.createdBy?.name || "N/A"
                                : item.key === "company.name"
                                ? Payment.company?.name || "N/A"
                                : Payment[item.key] || "N/A"}
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
        ) : (
          <div className="flex items-center justify-center">
            <p>{t("noPaymentsFound")}</p>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-5">
            <Pagination
              page={page}
              totalPages={totalPages}
              nextPage={nextPage}
              prevPage={prevPage}
              goToPage={goToPage}
            />
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default PaymentsByInvoice;
