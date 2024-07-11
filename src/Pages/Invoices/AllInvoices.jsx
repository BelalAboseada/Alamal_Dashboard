import { t } from "i18next";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";

const AllInvoices = () => {
  return (
    <div className="AllInvoices">
      <h1 className="Title">{t("invoices")}</h1>
      <ContentWrapper>
        <div className="Filters shadow-md rounded-md p-2 flex justify-between items-center">
    
        </div>
      </ContentWrapper>
    </div>
  );
};

export default AllInvoices;
