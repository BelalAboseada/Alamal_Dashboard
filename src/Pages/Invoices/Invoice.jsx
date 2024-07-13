import { useParams } from "react-router-dom";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import { useEffect, useState } from "react";
import { getInvoice } from "../../services/api";
import Loader from "../../components/Loader/Loader";

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
            <h2>Invoice Details</h2>
            <p>{id}</p>
            <p>
              <strong>Amount:</strong> {invoice.amount}
            </p>
            <p>
              <strong>Company:</strong> {invoice.company.name}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(invoice.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Created By:</strong> {invoice.createdBy}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(invoice.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Order Status:</strong> {invoice.orderStatus}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center ">
            <p>Invoice not found</p>
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Invoice;
