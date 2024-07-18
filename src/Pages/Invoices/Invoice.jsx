import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import { getInvoice } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { t } from "i18next";
import { NoSymbolIcon } from "@heroicons/react/24/solid";
import { Breadcrumbs } from "@material-tailwind/react";
import InvoiceImage from "../../assets/web-design-invoice.webp";
import "./style.scss";

const Invoice = () => {
  let { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInvoice(id);
        setInvoice(data.results);
        console.log("Fetched invoice:", data);
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

  return (
    <div className="Invoice" key={id}>
      <ContentWrapper>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : invoice ? (
          <div className="invoice-details">
            <h1 className="Title">{t("invoicesDetails")}</h1>
            <div className="Header shadow-md rounded-md p-2 flex justify-between items-center text-right">
              <div className="Breadcrumb">
                <Breadcrumbs>
                  <Link
                    to="/"
                    className="opacity-60 text-black text-base font-extrabold "
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
                  <Link to="/AllInvoices" className="text-base font-extrabold ">
                    <span>{t("invoices")}</span>
                  </Link>
                  <span className="text-base font-extrabold ">
                    {t("invoice")}
                  </span>
                </Breadcrumbs>
              </div>
            </div>
            <div className="content grid grid-cols-12 gap-5 mt-5">
              <div className="col-span-12 md:col-span-6 lg:col-span-4 flex items-center justify-center">
                <div className="InvoiceImg">
                  <img
                    alt="invoice"
                    className="rounded-md m-3 shadow-lg bg-cover clickable-image"
                    src={InvoiceImage}
                    width={280}
                    height={280}
                    onClick={() => openImageModal(InvoiceImage)}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-8 flex   flex-col items-center text-right  md:items-start  mt-6">
                <div className="flex gap-8 items-center my-2 w-full">
                  <div className="InvoiceId flex gap-1 py-1">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("invoiceId")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">{id}</p>
                  </div>
                </div>
                <div className="flex  gap-8  items-center my-2   w-full ">
                  <div className="dropComment flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("comment")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {invoice.dropComment}
                    </p>
                  </div>
                </div>
                <div className="flex  gap-8  items-center my-2   w-full ">
                  <div className="dropStatus flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("note")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {invoice.dropStatus}
                    </p>
                  </div>
                </div>
                <div className="flex gap-8    items-center my-2   w-full">
                  <div className="amount flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("amount")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {invoice.amount}
                    </p>
                  </div>
                </div>
                <div className="flex gap-8    items-center my-2   w-full">
                  <div className="invoiceStatus flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("invoiceStatus")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {invoice.invoiceStatus}
                    </p>
                  </div>
                  <div className="orderStatus flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("orderStatus")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {invoice.orderStatus}
                    </p>
                  </div>
                </div>
                <div className="flex gap-8   items-center my-2   w-full">
                  <div className="companyName flex gap-1  py-1  ">
                    <p className="ont-normal text-base mx-1">
                      <strong>{t("companyName")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {invoice.company.name}
                    </p>
                  </div>
                  <div className="pharmacy flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("pharmacy")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {invoice.pharmacy.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-8   items-center my-2   w-full">
                  <div className="driver flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("driver")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {invoice.driver.name}
                    </p>
                  </div>
                  <div className="CreatedBy flex gap-1  py-1 ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("createdBy")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {invoice.createdBy.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-8   items-center my-2   w-full">
                  <div className="CreatedAt flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("date")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-col">
            <span className="NotFound text-center">
              <NoSymbolIcon className="w-56 h-56" />
            </span>
            <p>
              <strong className="font-extrabold  text-2xl">
                Invoice not found
              </strong>
            </p>
          </div>
        )}

        {/* Modal for Enlarged Image */}
        {enlargedImage && (
          <div className="modal-overlay" onClick={closeImageModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <span className="close" onClick={closeImageModal}>
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
