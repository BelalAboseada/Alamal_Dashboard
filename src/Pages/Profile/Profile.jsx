import { t } from "i18next";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import ButtonUI from "../../components/UI/Button";
import "./style.scss";
import { UpdateProfile } from "../../components/Profile/UpdatePofile";
import { Chip } from "@material-tailwind/react";
import { DeleteAccount } from "../../components/Profile/DeleteProfile";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const options = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

   const getRoleColor = (role) => {
     switch (role) {
       case "pharmacy":
         return "blue";
       case "rep":
         return "black";
       case "driver":
         return "green";
       case "admin":
         return "red";
       case "supervisor":
         return "gray";
       default:
         return "blue";
     }
   };
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Token:", token);
    console.log("User Data:", storedUser);

    if (storedUser) {
      setUser(storedUser);  
    }

    if (token) {
      toast.success("Logged In Successfully", options);
      console.log("toast sent");
      localStorage.removeItem("token");
    }

    setLoading(false);
  }, []);

  return (
    <div className="Profile">
      <ToastContainer />
      <ContentWrapper>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : user ? (
          <>
            <div className="title text-center">
              <h1 className="font-bold text-2xl">{t("myProfile")}</h1>
            </div>
            <div className="grid grid-cols-12 gap-4 mt-5 bg-gray-100 md:bg-white p-5 rounded-md">
              <div className="col-span-12  md:col-span-4 lg:col-span-4 flex justify-center ">
                <div className="avatar">
                  <img
                    className="h-60 w-60  rounded-full md:h-80 md:w-80 md:rounded-md object-cover object-center bg-transparent"
                    src={user.profilePic}
                    alt="avatar"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 flex flex-col">
                <div className="username mt-5 mb-2 mx-2  md:my-2 md:mx-0">
                  <h2 className="m-1 text-2xl font-medium">{user.name}</h2>
                </div>
                <div className="email">
                  <h2 className="my-2 mx-1 text-lg font-normal text-slate-700">
                    {user.email}
                  </h2>
                </div>

                <div className="flex  gap-4 my-2">
                  <div className="role">
                    <Chip
                      variant="filled"
                      color={getRoleColor(user.role)}
                      value={user.role}
                      className="w-fit"
                    />
                  </div>
                  <div className="isActive">
                    <Chip
                      variant="filled"
                      color={user.isActive ? "green" : "red"}
                      value={user.isActive ? "Active" : "InActive"}
                      className="w-fit"
                    />
                  </div>
                </div>
                <div className="balance flex my-2">
                  <h2 className="m-1">{t("balance")} :</h2>
                  <h2 className="m-1">{user.balance} $</h2>
                </div>

                <div className="flex sm:w-fit flex-col md:flex-row mt-5">
                  <UpdateProfile user={user} />
                  <DeleteAccount userId={user._id} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className=" flex justify-center  flex-col items-center mt-5">
            <h4 className="text-lg font-bold">{t("YouDontHaveAccount")}</h4>
            <Link to="/signIn">
              <ButtonUI>{t("login")}</ButtonUI>
            </Link>
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Profile;
