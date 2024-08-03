import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import ButtonUI from "../../components/UI/Button";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteAccount } from "../../services/api";
import { t } from "i18next";

export function DeleteAccount({ userId }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const options = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteAccount(userId);
      if (response) {
        setOpen(false);
        console.log("Account deleted successfully!");
        localStorage.removeItem("user");
        window.location.reload();
        toast.success("Account deleted successfully!", options);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Error deleting account", options);
    }
  };

  return (
    <>
      <ButtonUI
        onClick={handleOpen}
        className="bg-red-600 flex text-center items-center"
      >
        <span>
          <TrashIcon className="text-white" />
        </span>{" "}
        {t("delete")}
      </ButtonUI>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>
          <Typography variant="h5" color="blue-gray">
            {t("delHeader")}!
          </Typography>
        </DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-16 w-16 text-black"
          >
            <path
              fillRule="evenodd"
              d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
              clipRule="evenodd"
            />
          </svg>
          <Typography variant="h4">{t("delHead")}!</Typography>
          <Typography className="text-start font-normal">
            {t("delContent")}
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={handleOpen}>
            {t("cancel")}
          </Button>
          <Button
            variant="gradient"
            color="red"
            ripple={false}
            onClick={handleDelete}
          >
            {t("delete")}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
