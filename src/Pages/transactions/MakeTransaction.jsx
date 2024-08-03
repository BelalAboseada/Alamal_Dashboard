import { t } from "i18next";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import { Input, Option, Select } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getAllUsers, makeTrans } from "../../services/api";
import ContentLoader from "../../components/Loader/ContentLoader";
import Button from "../../components/UI/Button";
import { toast } from "react-toastify";

const MakeTransaction = () => {
  const user = localStorage.getItem("user");
  const userId = JSON.parse(user)._id;

  const [amount, setAmount] = useState("");
  const [confirmed, setConfirmed] = useState("no");
  const [note, setNote] = useState("");
  const [receivers, setReceivers] = useState([]);
  const [receiversLoading, setReceiversLoading] = useState(true);
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [sender, setSender] = useState(userId);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const receiversData = await getAllUsers();
        setReceivers(receiversData);
        setReceiversLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setReceiversLoading(false);
      }
    };
    fetchData();
  }, []);

  const options = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transactionData = {
        amount,
        note,
        receiver: selectedReceiver,
        sender,
        confirmed,
      };
      const response = await makeTrans(transactionData);
      if (response) {
        console.log("Transaction created Successfully!", response);
        toast.success("Transaction created Successfully!", options);
        clearFormFields();
      }
    } catch (err) {
      console.log("error on handling submit => ", err);
      toast.error("Transaction failed!", options);
    }
  };
  const clearFormFields = () => {
    setAmount("");
    setConfirmed("no");
    setNote("");
    setSelectedReceiver("");
    setSender(userId);
  };

  return (
    <div className="MakeTransaction">
      <ContentWrapper>
        <h1 className="Title">{t("createTrans")}</h1>
        <form
          className="bg-gray-100 p-5 rounded-md shadow-sm mb-5"
          onSubmit={handleSubmit}
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
                className="Input w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
              />
            </div>
            <div className="my-2 mx-3 flex flex-col w-full ">
              <label
                htmlFor="receiver"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("receiverName")}
              </label>
              <Select
                variant="standard"
                placeholder={t("receiverName")}
                className="select w-full rounded-md border-0 py-2 shadow-md sm:text-sm sm:leading-6"
                value={selectedReceiver}
                onChange={(e) => setSelectedReceiver(e)}
                required
              >
                {receiversLoading ? (
                  <div className="flex justify-center items-center">
                    <ContentLoader />
                  </div>
                ) : (
                  receivers.map((receiver) => (
                    <Option key={receiver._id} value={receiver._id}>
                      {receiver.name}
                    </Option>
                  ))
                )}
              </Select>
            </div>
          </div>
          <div className="mt-5 space-y-5 md:space-y-0 md:space-x-5 md:flex md:items-center md:justify-between">
            <div className="my-2 mx-3 flex flex-col w-full ">
              <label
                htmlFor="Note"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("note")}
              </label>
              <Input
                variant="standard"
                placeholder={t("note")}
                id="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="Input w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
              />
            </div>
          </div>
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

export default MakeTransaction;
