import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const Home = () => {
  const [user, setUser] = useState(null);


 
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if ( storedUser) {
      setUser(storedUser);

    }
  }, []);

  
  
  const notify = () => toast.success("Account Created");

  return (
    <>
      <ToastContainer />
      {user ? (
        <div className="relative">

          <p>Hi ,{user.name}</p>
         
         
        </div>
      ) : (
        <>
          <Button onClick={notify}>Toast</Button>
          <Link to={"/SignIn"}>
            <Button>{t("login")}</Button>
          </Link>

          <Link to={"/SignUp"}>
            <Button>{t("signUp")}</Button>
          </Link>
        </>
      )}
    </>
  );
};

export default Home;
