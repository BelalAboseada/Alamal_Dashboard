import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import ButtonUI from "../../components/UI/Button";
import { t } from "i18next";
import { toast } from "react-toastify";
import "./style.scss";
import { updateProfile, uploadAvatar } from "../../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function UpdateProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleOpen = () => setOpen((prevOpen) => !prevOpen);

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
      const updatedData = { name, email };
      if (password) {
        updatedData.password = password;
      }
      if (image) {
        const imageUrl = await uploadAvatar(image);
        updatedData.profilePic = imageUrl;
      }

      const response = await updateProfile(user._id, updatedData);
      toast.success("Profile updated successfully", options);
      console.log("Profile updated successfully", response);
      localStorage.setItem("user", JSON.stringify({ ...user, ...updatedData }));
      handleOpen();

      navigate("/profile");
      window.location.reload();
    } catch (error) {
      toast.error("An error occurred while updating the profile", options);
      console.error(error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      console.log("Selected file:", file);
    }
  };

  return (
    <>
      <ButtonUI className="flex items-center text-center" onClick={handleOpen}>
        <span>
          <UserCircleIcon className="text-white" />
        </span>
        {t("UpdateProfile")}
      </ButtonUI>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <form onSubmit={handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" className="title_Update">
                {t("UpdateProfile")}
              </Typography>
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium leading-6"
                >
                  {t("uploadImage")}
                </label>
                <div className="mt-2">
                  <Input
                    variant="standard"
                    type="file"
                    id="file"
                    placeholder="Select Image"
                    className="Input_file w-full cursor-pointer rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="Name"
                  className="block text-sm font-medium leading-6"
                >
                  {t("userName")}
                </label>
                <div className="mt-2">
                  <Input
                    id="Name"
                    name="Name"
                    variant="static"
                    type="text"
                    autoComplete="name"
                    autoFocus
                    placeholder={user.name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="Input w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6"
                >
                  {t("email")}
                </label>
                <div className="mt-2">
                  <Input
                    id="email"
                    name="email"
                    variant="static"
                    type="text"
                    autoComplete="email"
                    placeholder={user.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="Input w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6"
                >
                  {t("password")}
                </label>
                <div className="mt-2">
                  <Input
                    id="password"
                    name="password"
                    variant="static"
                    type="password"
                    autoComplete="new-password"
                    placeholder={t("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="Input w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </CardBody>
            <CardFooter className="pt-0 flex items-center gap-2">
              <ButtonUI
                type="submit"
                variant="filled"
                ripple={false}
                className="btn_Update"
              >
                {t("update")}
              </ButtonUI>
              <Button
                variant="text"
                onClick={handleOpen}
                ripple={false}
                className="hover:bg-transparent"
              >
                {t("cancel")}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </>
  );
}
