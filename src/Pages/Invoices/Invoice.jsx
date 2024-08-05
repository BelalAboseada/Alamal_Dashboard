import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import { getInvoice, updateInvoice } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { t } from "i18next";
import { NoSymbolIcon } from "@heroicons/react/24/solid";
import { Breadcrumbs, Chip } from "@material-tailwind/react";
import "./style.scss";
import Button from "../../components/UI/Button";
import AddProductLine from "./AddProductLine";
import ProductLinesTable from "./ProductLine";
import { useSelector } from "react-redux";

const Invoice = ({ invoiceId, companyId, createdBy }) => {
  let { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const user = useSelector((state) => state.user.user);
  const canConfirmDelivering =
    user?.role !== "pharmacy" && user?.role !== "accountant";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInvoice(id);
        setInvoice(data.results);
        setOrderStatus(data.results.orderStatus);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const openImageModal = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const closeImageModal = () => {
    setEnlargedImage(null);
  };
  const canCreatePayment = user?.role !== "pharmacy";

  const handleStatusChange = async () => {
    let newStatus = "";
    if (orderStatus === "preparing") {
      newStatus = "delivering";
    } else if (orderStatus === "delivering") {
      newStatus = "delivered";
    } else {
      return;
    }

    setOrderStatus(newStatus);

    try {
      await updateInvoice(id, { orderStatus: newStatus });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const data = {
    invoiceId: id,
    companyId: invoice?.company?._id,
    createdBy: invoice?.createdBy?._id,
    pharmacyId: invoice?.pharmacy?._id,
    repId: invoice?.rep?._id,
  };

  return (
    <div className="Invoice" key={id}>
      <ContentWrapper>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : invoice ? (
          <>
            <div className="invoice-details">
              <h1 className="Title">{t("invoicesDetails")}</h1>
              <div className="Header shadow-md rounded-md p-2 flex justify-between items-center text-right">
                <div className="Breadcrumb">
                  <Breadcrumbs>
                    <Link
                      to="/"
                      className="opacity-60 text-black text-sm font-medium lg:text-base lg:font-normal "
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
                      className="text-sm font-medium lg:text-base lg:font-normal "
                    >
                      <span>{t("invoices")}</span>
                    </Link>

                    <Link
                      to={`/invoice/${id}`}
                      className="text-sm font-medium lg:text-base lg:font-normal "
                    >
                      <span>{t("invoice")}</span>
                    </Link>
                  </Breadcrumbs>
                </div>
              </div>
              <div className="content grid grid-cols-12 gap-5 mt-5">
                <div className="col-span-12 md:col-span-6 lg:col-span-4 flex items-center justify-center">
                  <div className="InvoiceImg">
                    <img
                      alt="invoice"
                      className="rounded-md m-3 shadow-lg bg-cover clickable-image cursor-pointer"
                      src={invoice.image}
                      width={300}
                      height={300}
                      onClick={() => openImageModal(invoice.image)}
                    />
                  </div>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-8 flex flex-col items-center text-right md:items-start mt-6">
                  <div className="flex gap-20 items-center my-1 w-full">
                    <div className="companyName flex gap-1 py-1">
                      <p className="font-bold text-base mx-1">
                        <strong>{t("companyName")}:</strong>
                      </p>
                      <p className="font-normal text-base text-black">
                        {invoice.company.name}
                      </p>
                    </div>
                    <div className="pharmacy flex gap-1 py-1">
                      <p className="font-bold text-base mx-1">
                        <strong>{t("pharmacy")}:</strong>
                      </p>
                      <p className="font-normal text-base text-black">
                        {invoice.pharmacy.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-20 items-center my-1 w-full">
                    <div className="invoiceStatus flex gap-1 py-1">
                      <p className="font-bold text-base mx-1">
                        <strong>{t("invoiceStatus")}:</strong>
                      </p>
                      <p className="font-normal text-base text-black">
                        {invoice.invoiceStatus}
                      </p>
                    </div>
                    <div className="orderStatus flex gap-1 py-1">
                      <Chip
                        value={orderStatus || "N/A"}
                        color={
                          orderStatus === "preparing"
                            ? "gray"
                            : orderStatus === "delivering"
                            ? "blue"
                            : orderStatus === "delivered"
                            ? "green"
                            : "gray"
                        }
                      >
                        {orderStatus}
                      </Chip>
                    </div>
                  </div>
                  <div className="flex gap-20 items-center my-1 w-full">
                    <div className="dropComment flex gap-1 py-1">
                      <p className="font-bold text-base mx-1">
                        <strong>{t("comment")}:</strong>
                      </p>
                      <p className="font-normal text-base text-black">
                        {invoice.dropComment}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-20 items-center my-1 w-full">
                    <div className="dropStatus flex gap-1 py-1">
                      <p className="font-normal text-base mx-1">
                        <strong>{t("note")}:</strong>
                      </p>
                      <p className="font-normal text-base text-black">
                        {invoice.dropStatus}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-20 items-center my-1 w-full">
                    <div className="amount flex gap-1 py-1">
                      <p className="font-bold text-base mx-1">
                        <strong>{t("amount")}:</strong>
                      </p>
                      <p className="font-normal text-base text-black">
                        {invoice.amount}$
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-20 items-center my-1 w-full">
                    <div className="driver flex gap-1 py-1">
                      <p className="font-bold text-base mx-1">
                        <strong>{t("driver")}:</strong>
                      </p>
                      <p className="font-normal text-base text-black">
                        {invoice.driver.name}
                      </p>
                    </div>
                    <div className="CreatedBy flex gap-1 py-1">
                      <p className="font-bold text-base mx-1">
                        <strong>{t("createdBy")}:</strong>
                      </p>
                      <p className="font-normal text-base text-black">
                        {invoice.createdBy.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-20 items-center my-1 w-full">
                    <div className="CreatedAt flex gap-1 py-1">
                      <p className="font-bold text-base mx-1">
                        <strong>{t("date")}:</strong>
                      </p>
                      <p className="font-normal text-base text-black">
                        {new Date(invoice.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className=" my-1 w-full Button_Wrapper">
                    <div className="flex  w-96">
                      {canConfirmDelivering && 
                      
                      <Button
                        className={`w-full ${
                          orderStatus === "delivered" ? "hidden" : ""
                        }`}
                        onClick={handleStatusChange}
                        disabled={orderStatus === "delivered"}
                      >
                        {orderStatus === "preparing"
                          ? t("start Delivering")
                          : orderStatus === "delivering"
                          ? t("mark As Delivered")
                          : t("delivered")}
                      </Button>
                      }
                      <AddProductLine invoiceId={id} />
                    </div>
                    <div className="flex w-96">
                      {canCreatePayment && (
                        <Button className={"w-full"}>
                          <Link
                            to={`/MakePayment?invoiceId=${data.invoiceId}&companyId=${data.companyId}&createdById=${data.createdBy}&pharmacyId=${data.pharmacyId}&repId=${data.repId}`}
                            className="text-white w-full"
                          >
                            {t("createPayment")}
                          </Link>
                        </Button>
                      )}
                      <Button className={"w-full"}>
                        <Link
                          to={`/payment/invoice/${id}`}
                          className="text-white w-full"
                        >
                          {t("payment")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="productLine mt-5">
              <ProductLinesTable
                productLines={invoice.productLines}
                Loading={loading}
                invoiceId={id}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-col">
            <span className="NotFound text-center">
              <NoSymbolIcon className="w-56 h-56" />
            </span>
            <p>
              <strong className="font-normal text-2xl">
                Invoice not found
              </strong>
            </p>
          </div>
        )}

        {/* Modal for Enlarged Image */}
        {enlargedImage && (
          <div className="modal-overlay" onClick={closeImageModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <span className="close  text-Black " onClick={closeImageModal}>
                &times;
              </span>
              <img
                className="enlarged-image"
                src={enlargedImage}
                alt="enlarged-invoice"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Invoice;
