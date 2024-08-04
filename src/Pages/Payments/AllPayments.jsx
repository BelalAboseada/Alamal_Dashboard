import { t } from "i18next";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import {
  Breadcrumbs,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Option,
  Select,
  Typography,
  Input,
  Button,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import usePagination from "../../hooks/UsePagination";
import {
  getAllPayments,
  getFilteredPayments,
  updatePayment,
  updateProfile,
} from "../../services/api";
import Pagination from "../../components/Pagination/Pagination";
import Loader from "../../components/Loader/Loader";
import { CheckCircleIcon, CheckIcon } from "@heroicons/react/24/outline";
import ContentLoader from "../../components/Loader/ContentLoader";

const AllPayments = () => {
  const [open, setOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const { page, nextPage, prevPage, goToPage, totalPages, updateTotalPages } =
    usePagination(1);

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllPayments(page);
        setPayments(data.results);
        updateTotalPages(data.count);
        console.log("Fetched Payments:", data.results);
        console.log("Total Pages:", totalPages);
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
      const data = await getFilteredPayments(filterType, filterValue);
      setPayments(data.results);
      updateTotalPages(data.count);
      console.log("Filtered Payments:", data.results);
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

const handleConfirm = async (paymentId) => {
  setLoadingId(paymentId);
  try {
    const result = await updatePayment(paymentId, {
      status: true,
    });
    console.log("Update result:", result);

    // Fetch updated payments
    const data = await getAllPayments(page);
    setPayments(data.results);
    updateTotalPages(data.count);

    // Retrieve user data from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      // Find the confirmed payment and add its amount to the user's balance
      const confirmedPayment = data.results.find(
        (payment) => payment._id === paymentId
      );
      if (confirmedPayment) {
        user.balance += confirmedPayment.amount;
        // Update local storage with the new balance
        localStorage.setItem("user", JSON.stringify(user));

        // Update the user profile in the database
        await updateProfile(user._id, { balance: user.balance });
        console.log("Updated user profile:", user);
      }
    }
  } catch (error) {
    console.error("Error updating payment:", error);
  } finally {
    setLoadingId(null);
  }
};

  const TABLE_HEAD = [
    { label: t("amount"), key: "amount" },
    { label: t("status"), key: "status" },
    { label: t("createdBy"), key: "createdBy" },
    { label: t("date"), key: "paymentDate" },
    { label: t("actions"), key: "actions" },
  ];

  return (
    <div className="AllPayments">
      <h1 className="Title">{t("payment")}</h1>
      <ContentWrapper>
        <div className="Header shadow-md rounded-md p-2 flex justify-between items-center text-right">
          <div className="Breadcrumb">
            <Breadcrumbs>
              <Link
                to={"/"}
                className="opacity-60 text-black text-sm font-medium lg:text-base lg:font-extrabold"
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
                to={"/AllPayments"}
                className="text-sm font-medium lg:text-base lg:font-extrabold"
              >
                <span>{t("payment")}</span>
              </Link>
            </Breadcrumbs>
          </div>
          <div className="Filter">
            <Tooltip
              className="bg-gray-100 text-blue-400"
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
                  className="right-0 font-medium text-base flex gap-1 items-center cursor-pointer"
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
                    onKeyUp={handleKeyUp}
                    onChange={(e) => handleSearchChange(e)}
                  />
                </div>
              </DialogBody>
              <DialogFooter className="space-x-2">
                <Button
                  variant="text"
                  color="gray"
                  ripple={false}
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
        ) : (
          <div className="content">
            {payments.length > 0 ? (
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
                    {payments.map((payment, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50 text-xs md:text-sm lg:text-base"
                      >
                        {TABLE_HEAD.map((item, headIndex) => (
                          <td key={headIndex} className="p-2 md:p-4 text-left">
                            {item.key === "actions" ? (
                              loadingId === payment._id ? (
                                <Button
                                  className="cursor-pointer bg-gray-500 p-2 rounded-lg"
                                  disabled
                                >
                                  <ContentLoader className="loader" />
                                </Button>
                              ) : (
                                <button
                                  className={`cursor-pointer p-2 rounded-lg ${
                                    payment.status === "true"
                                      ? "bg-gray-400"
                                      : "bg-green-500"
                                  }`}
                                  onClick={() => handleConfirm(payment._id)}
                                  disabled={payment.status === "true"}
                                >
                                  {payment.status === "true" ? (
                                    <CheckCircleIcon className="text-white" />
                                  ) : (
                                    <CheckIcon className="text-white" />
                                  )}
                                </button>
                              )
                            ) : item.key === "status" ? (
                              <Chip
                                size="sm"
                                className="w-fit mx-auto ml-5"
                                variant="ghost"
                                value={payment[item.key]}
                                color={
                                  payment[item.key] === "true"
                                    ? "green"
                                    : payment[item.key] === "false"
                                    ? "red"
                                    : "gray"
                                }
                              />
                            ) : (
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-medium"
                              >
                                {item.key === "paymentDate"
                                  ? new Date(
                                      payment[item.key]
                                    ).toLocaleDateString() || "N/A"
                                  : item.key === "createdBy"
                                  ? payment.createdBy?.name || "N/A"
                                  : payment[item.key] || "N/A"}
                              </Typography>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center mt-5">
                <h2>{t("noPaymentsFound")}</h2>
              </div>
            )}
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

export default AllPayments;
