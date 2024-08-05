import { t } from "i18next";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
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
import {
  AdjustmentsHorizontalIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import usePagination from "../../hooks/UsePagination";
import Loader from "../../components/Loader/Loader";
import {
  getAllTransactions,
  getFilteredTransactions,
  getUserById,
  updateProfile,
  updateTransaction,
} from "../../services/api";
import Pagination from "../../components/Pagination/Pagination";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import ContentLoader from "../../components/Loader/ContentLoader";
import "./style.scss";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AllTrans = () => {
  const user = useSelector((state) => state.user.user);
  // const User = JSON.parse(localStorage.getItem("user"))
  const userId = user._id;
  const isAdmin = user.role === "admin";
  const canConfirm = user.role === "accountant" || user.role === "admin";
  const [open, setOpen] = useState(false);
  const [trans, setTrans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const { page, nextPage, prevPage, goToPage, totalPages, updateTotalPages } =
    usePagination(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllTransactions(page, userId, isAdmin);
        setTrans(data.results);
        updateTotalPages(data.count);
        console.log("Fetched trans:", data.results);
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
      const data = await getFilteredTransactions(filterType, filterValue);
      setTrans(data.results);
      updateTotalPages(data.count, data.results.length);
      console.log("Filtered trans :", data.results);
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
  const handleConfirm = async (transactionId) => {
    setLoadingId(transactionId);
    try {
      await updateTransaction(transactionId, { confirmed: "yes" });

      // Fetch updated transactions
      const data = await getAllTransactions(page, userId);
      setTrans(data.results);
      updateTotalPages(data.count);

      // Retrieve user data from local storage
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const confirmedTransaction = data.results.find(
          (transaction) => transaction._id === transactionId
        );
        if (confirmedTransaction) {
          const senderId = confirmedTransaction.sender._id;
          const receiverId = confirmedTransaction.receiver._id;
          console.log("senderId => ", senderId);
          console.log("receiverId => ", receiverId);

          // Fetch sender and receiver profiles
          const [senderProfile, receiverProfile] = await Promise.all([
            getUserById(senderId),
            getUserById(receiverId),
          ]);
          console.log("Sender profile:", senderProfile);
          console.log("Receiver profile:", receiverProfile);

          if (senderProfile && receiverProfile) {
            // Safely access balance
            const senderBalance = senderProfile.results?.balance ?? 0;
            const receiverBalance = receiverProfile.results?.balance ?? 0;
            console.log("senderBalance => ", senderBalance);
            console.log("receiverBalance => ", receiverBalance);
            console.log(
              "confirmedTransaction.amount =>",
              confirmedTransaction.amount
            );

            // Check if the amount is more than the receiver's balance
            if (confirmedTransaction.amount > receiverBalance) {
              toast.error("Transaction amount exceeds receiver's balance");
              console.log("Transaction amount exceeds receiver's balance");
              // Revert the transaction confirmation
              await updateTransaction(transactionId, { confirmed: "no" });
              window.location.reload();
              return;
            }

            // Update sender's balance
            senderProfile.results.balance =
              senderBalance - confirmedTransaction.amount;
            await updateProfile(senderId, {
              balance: senderProfile.results.balance,
            });

            // Update receiver's balance
            receiverProfile.results.balance =
              receiverBalance + confirmedTransaction.amount;
            await updateProfile(receiverId, {
              balance: receiverProfile.results.balance,
            });

            // If the current user is the sender or receiver, update the local storage
            if (user._id === senderId || user._id === receiverId) {
              if (user._id === senderId) {
                user.balance = senderProfile.results.balance;
              } else if (user._id === receiverId) {
                user.balance = receiverProfile.results.balance;
              }
              localStorage.setItem("user", JSON.stringify(user));
            }

            console.log(
              "Updated user profiles:",
              senderProfile.results,
              receiverProfile.results
            );
          }
        }
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const TABLE_HEAD = [
    { label: t("amount"), key: "amount" },
    { label: t("confirmed"), key: "confirmed" },
    { label: t("sender"), key: "sender" },
    { label: t("receiverName"), key: "receiver" },
    { label: t("note"), key: "note" },
  ];
  if (canConfirm) {
    TABLE_HEAD.push({ label: t("actions"), key: "actions" });
  }

  return (
    <div className="AllTrans">
      <h1 className="Title">{t("viewTransactions")}</h1>
      <ContentWrapper>
        <div className="Header shadow-md rounded-md p-2 flex justify-between items-center text-right">
          <div className="Breadcrumb">
            <Breadcrumbs>
              <Link
                to={"/"}
                className="opacity-60 text-black  text-sm font-medium  lg:text-base lg:font-extrabold "
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
                to={"/AllTransactions"}
                className="  text-sm font-medium  lg:text-base lg:font-extrabold "
              >
                <span>{t("viewTransactions")}</span>
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
                    onChange={(e) => handleFilterChange(e)}
                  >
                    <Option value="sender">{t("sender")}</Option>
                    <Option value="receiver">{t("receiverName")}</Option>
                    <Option value="confirmed">{t("confirmed")}</Option>
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
                  color="blue"
                  ripple={false}
                  onClick={handleFilterSubmit}
                >
                  {t("submit")}
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
        </div>
        {loading ? (
          <div className="LoaderWrapper h-full w-full flex justify-center items-center">
            <Loader />
          </div>
        ) : trans.length > 0 ? (
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
                {trans.map((transaction, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 text-xs md:text-sm lg:text-base"
                  >
                    {TABLE_HEAD.map((item, headIndex) => (
                      <td key={headIndex} className="p-2 md:p-4 text-left">
                        {item.key === "actions" ? (
                          loadingId === transaction._id ? (
                            <Button
                              className="cursor-pointer bg-gray-500 p-2 rounded-lg"
                              disabled
                            >
                              <ContentLoader className="loader" />
                            </Button>
                          ) : (
                            <button
                              className={`cursor-pointer p-2 rounded-lg ${
                                transaction.confirmed === "yes"
                                  ? "bg-gray-400"
                                  : "bg-green-500"
                              }`}
                              onClick={() => handleConfirm(transaction._id)}
                              disabled={transaction.confirmed === "yes"}
                            >
                              {transaction.confirmed === "yes" ? (
                                <CheckCircleIcon className="text-white" />
                              ) : (
                                <CheckIcon className="text-white" />
                              )}
                            </button>
                          )
                        ) : item.key === "confirmed" ? (
                          <Chip
                            size="sm"
                            className="w-fit mx-auto ml-5"
                            variant="ghost"
                            value={transaction[item.key] || "N/A"}
                            color={
                              transaction[item.key] === "yes"
                                ? "green"
                                : transaction[item.key] === "no"
                                ? "red"
                                : "gray"
                            }
                          />
                        ) : (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {item.key === "note"
                              ? (transaction[item.key]?.length > 30
                                  ? `${transaction[item.key].slice(0, 30)}...`
                                  : transaction[item.key]) || "N/A"
                              : item.key === "sender"
                              ? transaction.sender?.name || "N/A"
                              : item.key === "receiver"
                              ? transaction.receiver?.name || "N/A"
                              : transaction[item.key] || "N/A"}
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
          <div className="p-4 text-center">
            <p>{t("noTransactionsFound")}</p>
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

export default AllTrans;
