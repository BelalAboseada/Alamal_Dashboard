import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import { getPayment } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { t } from "i18next";
import { NoSymbolIcon } from "@heroicons/react/24/solid";
import { Breadcrumbs } from "@material-tailwind/react";
import PaymentImage from "../../assets/dollar.png";
import "./style.scss";
import Button from "../../components/UI/Button";
import {} from "react-router-dom";
const PaymentDetails = () => {
  let { id } = useParams();
  const [Payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPayment(id);
        setPayment(data.results);
        console.log("Fetched Payment:", data);
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
  const data = {
    PaymentId: id,
    companyId: Payment?.company?._id,
    createdBy: Payment?.createdBy?._id,
  };

  return (
    <div className="Payment" key={id}>
      <ContentWrapper>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : Payment ? (
          <div className="Payment-details">
            <h1 className="Title">{t("PaymentsDetails")}</h1>
            <div className="Header shadow-md rounded-md p-2 flex justify-between items-center text-right">
              <div className="Breadcrumb">
                <Breadcrumbs>
                  <Link
                    to="/"
                    className="opacity-60 text-black text-sm font-medium  lg:text-base lg:font-extrabold "
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
                    to="/AllPayments"
                    className="text-sm font-medium  lg:text-base lg:font-extrabold  "
                  >
                    <span>{t("Payments")}</span>
                  </Link>

                  <Link
                    to={`/Payment/${id}`}
                    className="text-sm font-medium  lg:text-base lg:font-extrabold  "
                  >
                    <span>{t("Payment")}</span>
                  </Link>
                </Breadcrumbs>
              </div>
            </div>
            <div className="content grid grid-cols-12 gap-5 mt-5">
              <div className="col-span-12 md:col-span-6 lg:col-span-4 flex items-center justify-center">
                <div className="PaymentImg">
                  <img
                    alt="Payment"
                    className="rounded-md m-3 shadow-lg bg-cover clickable-image"
                    src={PaymentImage}
                    width={280}
                    height={280}
                    onClick={() => openImageModal(PaymentImage)}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-8 flex   flex-col items-center text-right  md:items-start  mt-6">
                <div className="flex gap-8 items-center my-2 w-full">
                  <div className="PaymentId flex gap-1 py-1">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("PaymentId")}:</strong>
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
                      {Payment.dropComment}
                    </p>
                  </div>
                </div>
                <div className="flex  gap-8  items-center my-2   w-full ">
                  <div className="dropStatus flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("note")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {Payment.dropStatus}
                    </p>
                  </div>
                </div>
                <div className="flex gap-8    items-center my-2   w-full">
                  <div className="amount flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("amount")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {Payment.amount}
                    </p>
                  </div>
                </div>
                <div className="flex gap-8    items-center my-2   w-full">
                  <div className="PaymentStatus flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("PaymentStatus")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {Payment.PaymentStatus}
                    </p>
                  </div>
                  <div className="orderStatus flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("orderStatus")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {Payment.orderStatus}
                    </p>
                  </div>
                </div>
                <div className="flex gap-8   items-center my-2   w-full">
                  <div className="companyName flex gap-1  py-1  ">
                    <p className="ont-normal text-base mx-1">
                      <strong>{t("companyName")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {Payment.company.name}
                    </p>
                  </div>
                  <div className="pharmacy flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("pharmacy")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {Payment.pharmacy.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-8   items-center my-2   w-full">
                  <div className="driver flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("driver")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {Payment.driver.name}
                    </p>
                  </div>
                  <div className="CreatedBy flex gap-1  py-1 ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("createdBy")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {Payment.createdBy.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-8   items-center my-2   w-full">
                  <div className="CreatedAt flex gap-1  py-1  ">
                    <p className="font-normal text-base mx-1">
                      <strong>{t("date")}:</strong>
                    </p>
                    <p className="font-extrabold  text-base text-black">
                      {new Date(Payment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-8   items-center my-2   w-full">
                  <Button>
                    <Link
                      to={`/MakePayment?PaymentId=${data.PaymentId}&companyId=${data.companyId}&createdById=${data.createdBy}`}
                      className="text-white w-full"
                    >
                      {t("createPayment")}
                    </Link>
                  </Button>
                  <Button>
                    <Link
                      to={`/payment/Payment/${id}`}
                      className="text-white w-full"
                    >
                      {t("payment")}
                    </Link>
                  </Button>
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
                Payment not found
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
                alt="enlarged-Payment"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default PaymentDetails;
