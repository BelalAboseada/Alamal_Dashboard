import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import { getFilteredPayments, getPaymentsByInvoice } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { t } from "i18next";
import "./style.scss";
import {
  Breadcrumbs,
  Button,
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
import Img from "../../assets/dollar.png";
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
      const data = await getFilteredPayments(filterType, filterValue);
      setPayments(data.results);
      updateTotalPages(data.count, data.results.length);
      console.log("Filtered payments:", data.results);
      // console.log("Total Pages:", totalPages);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  return (
    <div className="PaymentForInvoice">
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
              <Link
                to="/AllInvoices"
                className="text-xs font-medium lg:text-base lg:font-extrabold"
              >
                <span>{t("invoices")}</span>
              </Link>
              <Link
                to={`/invoice/${id}`}
                className="text-xs font-medium lg:text-base lg:font-extrabold"
              >
                <span>{t("invoice")}</span>
              </Link>
              <Link
                to={`/payment/invoice/${id}`}
                className="text-xs font-medium lg:text-base lg:font-extrabold"
              >
                <span>{t("paymentForInvoice")}</span>
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
          <>
            {payments.map((payment) => (
              <Link
                key={payment._id}
                to={`/payment/${payment._id}`}
                className="InvoiceItem shadow-md p-2 m-2 flex items-center gap-3 rounded-3xl"
              >
                <div className="logo">
                  <span>
                    <img
                      src={Img}
                      width={100}
                      height={100}
                      className="InvoiceImage"
                      alt="Invoice Image"
                    />
                  </span>
                </div>
                <div>
                  <p className="text-white">
                    <span className="font-bold text-base mx-2">
                      {t("amount")}:
                    </span>
                    {payment.amount}
                  </p>
                  <p className="text-white">
                    <span className="font-bold text-base mx-2">
                      {t("status")}:
                    </span>
                    {payment.status.toString()}
                  </p>
                  <p className="text-white">
                    <span className="font-bold text-base mx-2">
                      {t("date")}:
                    </span>
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
            <div className="flex items-center justify-center gap-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                nextPage={nextPage}
                prevPage={prevPage}
                goToPage={goToPage}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center">
            <p>{t("noPaymentsFound")}</p>
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default PaymentsByInvoice;
