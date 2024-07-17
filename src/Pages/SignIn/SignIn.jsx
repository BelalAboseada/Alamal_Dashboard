import { Link, useNavigate } from "react-router-dom";
import SignInImg from "../../assets/background.png";
import { signIn } from "../../services/api";
import { useState } from "react";
import Loading from "../../components/Loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { t } from "i18next";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
    setLoading(true);
    try {
      const data = await signIn(email, password);
      console.log("API response:", data);
      const token = data?.token;
      const user = data?.isFound;

      if (token && user) {
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/Profile");
        window.location.reload();
      } else {
        throw new Error("Token or user data not found in response");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      toast.error(err.message, options);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <ToastContainer />
      <div className="p-4 flex items-center justify-center w-full">
        {loading ? (
          <Loading />
        ) : (
          <div className="Wrapper grid grid-cols-1 md:grid-cols-12 gap-14 bg-white shadow-md p-6 rounded-lg overflow-hidden">
            <div className="col-span-1 md:col-span-6 mt-10 sm:mx-auto sm:w-full sm:max-w-sm rounded p-5">
              <h2 className="mx-10 text-center text-2xl font-bold leading-9 tracking-tight">
                {t("login")}
              </h2>

              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6"
                  >
                    {t("email")}
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:border-none sm:text-sm sm:leading-6"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none sm:text-sm sm:leading-6"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {t("login")}
                  </button>
                </div>
              </form>
              <p className="mt-10 text-center text-sm text-gray-500">
                {t("donotHaveAccount")}
                <Link to="/SignUp" className="font-semibold leading-6">
                  {t("signUp")}
                </Link>
              </p>
            </div>
            <div className="col-span-1 md:col-span-6 flex items-center justify-center">
              <img
                alt="alamal"
                src={SignInImg}
                className="mx-auto w-full md:w-auto"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
