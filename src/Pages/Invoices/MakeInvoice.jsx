import { t } from "i18next";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import {
  Input,
  Option,
  Popover,
  PopoverContent,
  PopoverHandler,
  Select,
} from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "./style.scss";
import { getDrivers, getPharmacies, getReps } from "../../services/api";

const MakeInvoice = () => {
  const [date, setDate] = useState();
  const [drivers, setDrivers] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [reps, setReps] = useState([]);

  useEffect(() => {
    // Fetch drivers from API
    const fetchDrivers = async () => {
      try {
        const driversData = await getDrivers();
        setDrivers(driversData);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    // Fetch pharmacies from API
    const fetchPharmacies = async () => {
      try {
        const pharmaciesData = await getPharmacies();
        setPharmacies(pharmaciesData);
      } catch (error) {
        console.error("Error fetching pharmacies:", error);
      }
    };
    // Fetch Reps from API
    const fetchReps = async () => {
      try {
        const repsData = await getReps();
        setReps(repsData);
      } catch (error) {
        console.error("Error fetching Reps:", error);
      }
    };

    fetchDrivers();
    fetchPharmacies();
    fetchReps();
  }, []);

  return (
    <div className="MakeInvoice">
      <ContentWrapper>
        <h1 className="Title">{t("makeInvoices")}</h1>

        <div className="flex items-center justify-between mt-5">
          <div className="my-2  mx-3 flex flex-col w-full ">
            <label
              htmlFor="Pharmacy"
              className="block text-sm font-medium leading-6 mb-2"
            >
              Select a Pharmacy
            </label>
            <Select
              variant="standard"
              placeholder="Select a Pharmacy"
              id="Pharmacy"
              className="select w-full rounded-md border-0 py-2 shadow-sm outline-none focus:outline-none sm:text-sm sm:leading-6"
              required
            >
              {pharmacies.map((pharmacy) => (
                <Option key={pharmacy.id} value={pharmacy.id}>
                  {pharmacy.name}
                </Option>
              ))}
            </Select>
          </div>

          <div className="my-2 mx-3 flex flex-col w-full ">
            <label
              htmlFor="Medical Rep"
              className="block text-sm font-medium leading-6 mb-2"
            >
              Select a Medical Rep
            </label>
            <Select
              variant="standard"
              placeholder="Select a Medical Rep"
              id="Medical-Rep"
              className="select w-full rounded-md border-0 py-2 shadow-sm outline-none focus:outline-none sm:text-sm sm:leading-6"
              required
            >
              {reps.map((rep) => (
                <Option key={rep.id} value={rep.id}>
                  {rep.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5">
          <div className="my-2  mx-3 flex flex-col w-full ">
            <label
              htmlFor="Driver"
              className="block text-sm font-medium leading-6 mb-2"
            >
              Select a Driver
            </label>
            <Select
              variant="static"
              placeholder="Select a Driver"
              id="Driver"
              className="select w-full rounded-md border-0 py-2 shadow-sm outline-none focus:outline-none sm:text-sm sm:leading-6"
              required
            >
              {drivers.map((driver) => (
                <Option key={driver.id} value={driver.id}>
                  {driver.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="my-2 mx-3 flex flex-col w-full ">
            <label
              htmlFor="Totally Paid"
              className="block text-sm font-medium leading-6 mb-2"
            >
              {t("totalPaid")}
            </label>
            <Select
              variant="standard"
              placeholder="Totally Paid"
              className="select w-full rounded-md border-0 py-2 shadow-sm outline-none focus:outline-none sm:text-sm sm:leading-6"
              required
            >
              <Option value="notPaid">Not Paid</Option>
              <Option value="partiallyPaid">Partially Paid</Option>
              <Option value="totallyPaid">Totally Paid</Option>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5">
          <div className="my-2 mx-3 flex flex-col w-full ">
            <label
              htmlFor="Select Invoice"
              className="block text-sm font-medium leading-6 mb-2"
            >
              Select Invoice Type
            </label>
            <Select
              variant="standard"
              placeholder="Select Invoice Type"
              className="select w-full rounded-md border-0 py-2 shadow-sm outline-none focus:outline-none sm:text-sm sm:leading-6"
              required
            >
              <Option value="Normal">Normal</Option>
              <Option value="Return">Return</Option>
            </Select>
          </div>
          <div className="my-2 mx-3 flex flex-col w-full ">
            <label
              htmlFor="Select Invoice"
              className="block text-sm font-medium leading-6 mb-2"
            >
              Select Invoice Status
            </label>
            <Select
              variant="standard"
              placeholder="Select Invoice Type"
              className="select w-full rounded-md border-0 py-2 shadow-sm outline-none focus:outline-none sm:text-sm sm:leading-6"
              required
            >
              <Option value="Not Paid">Not Paid</Option>
              <Option value="Partially Paid">Partially Paid</Option>
              <Option value="Totally Paid">Totally Paid</Option>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5">
          <div className="my-2 mx-3 flex flex-col w-full ">
            <label
              htmlFor="Select Order Status"
              className="block text-sm font-medium leading-6 mb-2"
            >
              Select Order Status
            </label>
            <Select
              variant="standard"
              placeholder="Select Order Status"
              className="select w-full rounded-md border-0 py-2 shadow-sm outline-none focus:outline-none sm:text-sm sm:leading-6"
              required
            >
              <Option value="Preparing">Preparing</Option>
              <Option value="delivered">delivered</Option>
              <Option value="dilevering">Preparieng</Option>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5">
          <div className="my-2 mx-3 flex flex-col w-full ">
            <Input
              variant="standard"
              label="Amount"
              placeholder="Amount"
              className="Input w-full rounded-md border-0 py-2  shadow-sm outline-none  focus:outline-none sm:text-sm sm:leading-6"
            />
          </div>
          <div className="my-2 mx-3 flex flex-col w-full ">
            <Input
              variant="standard"
              label="Comment"
              placeholder="Comment"
              className="Input w-full rounded-md border-0 py-2  shadow-sm outline-none  focus:outline-none sm:text-sm sm:leading-6"
            />
          </div>
          <div className="my-2 mx-3 flex flex-col w-full ">
            <Input
              variant="standard"
              label="Note"
              placeholder="Note"
              className="Input w-full rounded-md border-0 py-2  shadow-sm outline-none  focus:outline-none sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-3  mt-5">
          <div className="py-10">
            <Popover placement="bottom">
              <PopoverHandler>
                <Input
                  variant="standard"
                  label="Select a Date"
                  onChange={() => null}
                  value={date ? format(date, "PPP") : ""}
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
          <div className="my-2 mx-3 flex flex-col w-50">
            <Input
              variant="standard"
              type="file"
              label="Select Image"
              placeholder="Select Image"
              className="Input_file w-full cursor-pointer rounded-md border-0 py-2  shadow-sm  sm:text-sm sm:leading-6 "
            />
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default MakeInvoice;
