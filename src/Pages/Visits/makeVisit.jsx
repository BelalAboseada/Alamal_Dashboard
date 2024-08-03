import { t } from "i18next";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import { Input, Option, Select } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  getDrivers,
  getPharmacies,
  getReps,
  makeVisit,
} from "../../services/api";
import ContentLoader from "../../components/Loader/ContentLoader";
import { toast } from "react-toastify";
import Button from "../../components/UI/Button";

const MakeVisit = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [reps, setReps] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [hasPayment, setHasPayment] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [comment, setComment] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const [selectedRep, setSelectedRep] = useState("");
  const [pharmaciesLoading, setPharmaciesLoading] = useState(true);
  const [repsLoading, setRepsLoading] = useState(true);
  const [driversLoading, setDriversLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const driversData = await getDrivers();
        setDrivers(driversData);
        setDriversLoading(false);
        const pharmaciesData = await getPharmacies();
        setPharmacies(pharmaciesData);
        setPharmaciesLoading(false);

        const repsData = await getReps();
        setReps(repsData);
        setRepsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
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

    if (!selectedPharmacy || !selectedRep || !selectedDriver || !hasPayment) {
      toast.error("Data is required!");
      return;
    }

    const user = localStorage.getItem("user");
    const userId = JSON.parse(user)._id;
    const companyId = JSON.parse(user).company;

    try {
      const visitData = {
        pharmacy: selectedPharmacy,
        rep: selectedRep,
        driver: selectedDriver,
        createdBy: userId,
        company: companyId,
        hasPayment,
        type,
        comment,
        location,
      };

      const response = await makeVisit(visitData);

      if (response) {
        console.log("Visit created successfully", response);
        toast.success("Visit created successfully", options);
        clearFormFields();
      }
    } catch (error) {
      console.error("Error creating Visit:", error);
      toast.error("Error creating Visit", options);
    }
  };
  const clearFormFields = () => {
    setSelectedPharmacy("");
    setSelectedRep("");
    setSelectedDriver("");
    setHasPayment("");
    setStatus("");
    setType("");
    setComment("");
    setLocation("");
  };
  return (
    <div className="MakeVisit">
      <ContentWrapper>
        <h1 className="Title">{t("makeVisit")}</h1>
        <form
          className="bg-gray-100 p-5 rounded-md shadow-sm mb-5"
          onSubmit={handleSubmit}
        >
          <div className="mt-5 space-y-5 md:space-y-0 md:space-x-5 md:flex md:items-center md:justify-between">
            <div className="my-2  mx-3 flex flex-col w-full ">
              <label
                htmlFor="Pharmacy"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("selectPharmacy")}
              </label>
              <Select
                variant="standard"
                placeholder="Select a Pharmacy"
                id="Pharmacy"
                className="select w-full rounded-md border-0 p-2 shadow-md  sm:text-sm sm:leading-6"
                value={selectedPharmacy}
                onChange={(e) => setSelectedPharmacy(e)}
                required
              >
                {pharmaciesLoading ? (
                  <div className="flex justify-center items-center ">
                    <ContentLoader />
                  </div>
                ) : (
                  pharmacies.map((pharmacy) => (
                    <Option key={pharmacy._id} value={pharmacy._id}>
                      {pharmacy.name}
                    </Option>
                  ))
                )}
              </Select>
            </div>
            <div className="my-2 mx-3 flex flex-col w-full ">
              <label
                htmlFor="Medical Rep"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("selectMedicalRep")}
              </label>
              <Select
                variant="standard"
                placeholder="Select a Medical Rep"
                id="Medical-Rep"
                className="select w-full rounded-md border-0 p-2 shadow-md  sm:text-sm sm:leading-6"
                value={selectedRep}
                onChange={(e) => setSelectedRep(e)}
                required
              >
                {repsLoading ? (
                  <div className="flex justify-center items-center">
                    <ContentLoader />
                  </div>
                ) : (
                  reps.map((rep) => (
                    <Option key={rep._id} value={rep._id}>
                      {rep.name}
                    </Option>
                  ))
                )}
              </Select>
            </div>
          </div>
          <div className="mt-5 space-y-5 md:space-y-0 md:space-x-5 md:flex md:items-center md:justify-between">
            <div className="my-2 mx-3 flex flex-col w-full ">
              <label
                htmlFor="Select status"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("type")}
              </label>
              <Select
                variant="standard"
                placeholder={t("type")}
                className="select w-full rounded-md border-0 py-2 shadow-md sm:text-sm sm:leading-6"
                value={type}
                onChange={(e) => setType(e)}
                required
              >
                <Option value="single">Single</Option>
                <Option value="double">Double</Option>
              </Select>
            </div>
            <div className="my-2  mx-3 flex flex-col w-full ">
              <label
                htmlFor="Driver"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("selectDriverValue")}
              </label>
              <Select
                variant="standard"
                placeholder="Select a Driver"
                id="Driver"
                className="select w-full rounded-md border-0 p-2 shadow-md  sm:text-sm sm:leading-6"
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e)}
                required
              >
                {driversLoading ? (
                  <div className="flex justify-center items-center">
                    <ContentLoader />
                  </div>
                ) : (
                  drivers.map((driver) => (
                    <Option key={driver._id} value={driver._id}>
                      {driver.name}
                    </Option>
                  ))
                )}
              </Select>
            </div>
          </div>
          <div className="mt-5 space-y-5 md:space-y-0 md:space-x-5 md:flex md:items-center md:justify-between">
            <div className="my-2 mx-3 flex flex-col w-full ">
              <label
                htmlFor="hasPayment"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("hasPayment")}
              </label>
              <Select
                variant="standard"
                placeholder="Select hasPayment"
                className="select w-full rounded-md border-0 py-2 shadow-md sm:text-sm sm:leading-6"
                value={hasPayment}
                onChange={(e) => setHasPayment(e)}
                required
              >
                <Option value="true">True</Option>
                <Option value="false">False</Option>
              </Select>
            </div>
           
            <div className="my-2 mx-3 flex flex-col w-full ">
              <label
                htmlFor="location"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("location")}
              </label>
              <Input
                variant="standard"
                id="location"
                placeholder={t("location")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="Input w-full rounded-md border-0 p-2   shadow-md sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="mt-5 space-y-5 md:space-y-0 md:space-x-5 md:flex md:items-center md:justify-between">
            <div className="my-2 mx-3 flex flex-col w-full ">
              <label
                htmlFor="comment"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("comment")}
              </label>
              <Input
                variant="standard"
                id="comment"
                placeholder={t("comment")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="Input w-full rounded-md border-0 p-2   shadow-md sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="text-center mt-5">
            <Button type="submit" className="w-64" onClick={handleSubmit}>
              {t("done")}
            </Button>
          </div>
        </form>
      </ContentWrapper>
    </div>
  );
};

export default MakeVisit;
