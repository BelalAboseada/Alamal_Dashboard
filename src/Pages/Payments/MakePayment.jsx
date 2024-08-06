import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { t } from "i18next";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import {
  Input,
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { CreatePayment } from "../../services/api";
import { useLocation } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import Button from "../../components/UI/Button";

const MakePayment = () => {
  const [date, setDate] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const [selectedRep, setSelectedRep] = useState("");
  const [status, setStatus] = useState(false);
  const [amount, setAmount] = useState("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const invoiceId = params.get("invoiceId");
  const companyId = params.get("companyId");
  const createdById = params.get("createdById");
  const pharmacyId = params.get("pharmacyId");
  const repId = params.get("repId");

  const options = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !selectedPharmacy || !date  || !selectedRep) {
      toast.error("Please fill out all required fields.", options);
      return;
    }

    try {
      const paymentData = {
        invoice: invoiceId,
        company: companyId,
        createdBy: createdById,
        amount: parseFloat(amount),
        pharmacy: pharmacyId,
        rep: repId,
        paymentDate: date ? format(date, "yyyy-MM-dd") : null,
        status,
      };


      const response = await CreatePayment(paymentData);

      if (response) {
        toast.success(t("paymentAddSuccessfully"), options);
        clearFormFields();
      }
    } catch (err) {
      console.error("Error making payment:", err);
      toast.error("Error making payment!");
    }
  };

  const clearFormFields = () => {
    setSelectedPharmacy("");
    setSelectedRep("");
    setAmount("");
    setStatus(false);
    setDate(null);
  };

  return (
    <div className="MakePayment">
      <ContentWrapper>
        <h1 className="Title">{t("makePayment")}</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-5 rounded-md shadow-sm mb-5"
        >
          <div className="mt-5 space-y-5 md:space-y-0 md:space-x-5 md:flex md:items-center md:justify-between">
            <div className="my-2 mx-3 flex flex-col w-full ">
              <label
                htmlFor="Amount"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("amount")}
              </label>
              <Input
                variant="standard"
                id="Amount"
                placeholder={t("amount")}
                value={amount}
                onChange={handleAmountChange}
                className="Input w-full rounded-md border-0 p-2   shadow-md sm:text-sm sm:leading-6"
              />
            </div>
            <div className="w-full mx-3">
              <label
                htmlFor="Date"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("date")}
              </label>
              <Popover placement="bottom">
                <PopoverHandler>
                  <Input
                    variant="standard"
                    id="Date"
                    onChange={() => null}
                    className="Input w-full rounded-md border-0 p-2   shadow-md sm:text-sm sm:leading-6"
                    value={date ? format(date, "dd-MM-yyyy") : ""}
                  />
                </PopoverHandler>
                <PopoverContent>
                  <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    showOutsideDays
                    className="border-0 w-full"
                    classNames={{
                      caption:
                        "flex justify-center py-2 mb-4 relative items-center",
                      caption_label: "text-sm font-medium text-gray-900",
                      nav: "flex items-center",
                      nav_button:
                        "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                      nav_button_previous: "absolute left-1.5",
                      nav_button_next: "absolute right-1.5",
                      table: "w-full border-collapse",
                      head_row: "flex font-medium text-gray-900",
                      head_cell: "m-0.5 w-9 font-normal text-sm",
                      row: "flex w-full mt-2",
                      cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal",
                      day_range_end: "day-range-end",
                      day_selected:
                        "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                      day_today: "rounded-md bg-gray-200 text-gray-900",
                      day_outside:
                        "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                      day_disabled: "text-gray-500 opacity-50",
                      day_hidden: "invisible",
                    }}
                    components={{
                      IconLeft: ({ ...props }) => (
                        <ChevronLeftIcon
                          {...props}
                          className="h-4 w-4 stroke-2"
                        />
                      ),
                      IconRight: ({ ...props }) => (
                        <ChevronRightIcon
                          {...props}
                          className="h-4 w-4 stroke-2"
                        />
                      ),
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="mt-5 space-y-5 md:space-y-0 md:space-x-5 md:flex md:items-center md:justify-between"></div>
          <div className="text-center mt-5">
            <Button type="submit" className="w-64">
              {t("done")}
            </Button>
          </div>
        </form>
      </ContentWrapper>
    </div>
  );
};

export default MakePayment;
