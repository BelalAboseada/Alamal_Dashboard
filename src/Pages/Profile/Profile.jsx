import { t } from "i18next";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import Button from "../../components/UI/Button";
import "./style.scss";

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
            <div className="flex flex-col mt-5">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="username wrapper flex  items-center bg-gray-100 m-4 px-4 py-2 rounded-3xl">
                  <h2 className="text-lg font-bold">{t("userName")}:</h2>
                  <p className="m-1">{user.name}</p>
                </div>
                <div className="email wrapper flex  items-center bg-gray-100 m-4 px-4 py-2 rounded-3xl">
                  <h2 className="text-lg font-bold">{t("email")}:</h2>
                  <p className="m-1">{user.email}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="role  wrapper  flex  items-center bg-gray-100 m-4  px-4 py-2 rounded-3xl">
                  <h2 className="text-lg font-bold">{t("role")}:</h2>
                  <p className="m-1">{user.role}</p>
                </div>
                <div className="balance  wrapper flex  items-center bg-gray-100 m-4 px-4 py-2 rounded-3xl">
                  <h2 className="text-lg font-bold">{t("balance")}:</h2>
                  <p className="m-1">{user.balance}</p>
                </div>
                <div className="verified wrapper  flex  items-center bg-gray-100 m-4 px-4 py-2 rounded-3xl">
                  <h2 className="text-lg font-bold">{t("verified")}:</h2>
                  <p className="m-1">{user.verified ? t("yes") : t("no")}</p>
                </div>
              </div>
              <div className="isActive wrapper flex  items-center bg-gray-100 m-4 px-4 py-2 rounded-3xl">
                <h2 className="text-lg font-bold">{t("isActive")}:</h2>
                <p className="m-1">{user.isActive ? t("yes") : t("no")}</p>
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <Button>{t("createTrans")}</Button>
              <Button>{t("viewTransactions")}</Button>
            </div>
          </>
        ) : (
          <div className=" flex justify-center  flex-col items-center mt-5">
            <h4 className="text-lg font-bold">{t("YouDontHaveAccount")}</h4>
            <Link to="/signIn">
              <Button>{t("login")}</Button>
            </Link>
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Profile;
