import { Link, useParams } from "react-router-dom";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import { useEffect, useState } from "react";
import { getInvoice } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { t } from "i18next";
import Skelton from "../../assets/images.png";
import { NoSymbolIcon } from "@heroicons/react/24/solid";
import { Breadcrumbs } from "@material-tailwind/react";
const Invoice = () => {
  let { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInvoice(id);
        setInvoice(data.results);
        console.log("Fetched invoice:", data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="Invoice" key={id}>
      <ContentWrapper>
        {loading ? (
          <div className="flex items-center justify-center ">
            <Loader />
          </div>
        ) : invoice ? (
          <div className="invoice-details">
            <h1 className="Title">{t("invoicesDetails")}</h1>
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
                  <Link to={`/invoice/${id}`} className="  text-base font-bold">
                    <span>{t("invoice")}</span>
                  </Link>
                </Breadcrumbs>
              </div>
            </div>
            <div className="content grid grid-cols-2 mt-5">
              <div className="grid-cols-2  md:grid-cols-2 lg:grid-cols-2">
                <div className="InvoiceImg">
                  <img
                    alt="invoice"
                    className="border-collapse rounded-md m-3  shadow-lg bg-cover"
                    src={invoice.image}
                    width={250}
                    height={300}
                  />
                </div>
              </div>
              <div className="grid-cols-2  md:grid-cols-2 lg:grid-cols-2">
                <div className="InvoiceId flex gap-1">
                  <p>
                    <strong>{t("invoiceId")}:</strong>
                  </p>
                  <p>{id}</p>
                </div>
                <div className="dropComment flex gap-1">
                  <p>
                    <strong>{t("comment")}:</strong>
                  </p>
                  <p>{invoice.dropComment}</p>
                </div>
                <div className="dropStatus flex gap-1">
                  <p>
                    <strong>{t("note")}:</strong>
                  </p>
                  <p>{invoice.dropStatus}</p>
                </div>
                <div className="amount flex gap-1">
                  <p>
                    <strong>{t("amount")}:</strong>
                  </p>
                  <p>{invoice.amount}</p>
                </div>
                <div className="invoiceStatus flex gap-1">
                  <p>
                    <strong>{t("invoiceStatus")}:</strong>
                  </p>
                  <p>{invoice.invoiceStatus}</p>
                </div>
                <div className="orderStatus flex gap-1">
                  <p>
                    <strong>{t("orderStatus")}:</strong>
                  </p>
                  <p>{invoice.orderStatus}</p>
                </div>
                <div className="companyName flex gap-1">
                  <p>
                    <strong>{t("companyName")}:</strong>
                  </p>
                  <p>{invoice.company.name}</p>
                </div>
                <div className="pharmacy flex gap-1">
                  <p>
                    <strong>{t("pharmacy")}:</strong>
                  </p>
                  <p>{invoice.pharmacy.name}</p>
                </div>
                <div className="driver flex gap-1">
                  <p>
                    <strong>{t("driver")}:</strong>
                  </p>
                  <p>{invoice.driver.name}</p>
                </div>
                <div className="CreatedAt flex gap-1">
                  <p>
                    <strong>{t("date")}:</strong>
                  </p>
                  <p>{new Date(invoice.date).toLocaleDateString()}</p>
                </div>
                <div className="CreatedBy flex gap-1">
                  <p>
                    <strong>{t("createdBy")}:</strong>
                  </p>
                  <p>{invoice.createdBy.name}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-col">
            <span className="NotFound text-center ">
              <NoSymbolIcon className="w-56 h-56 " />
            </span>
            <p>
              <strong className="font-bold text-2xl ">Invoice not found</strong>
            </p>
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Invoice;
