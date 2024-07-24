import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignUpImg from "../../assets/Mobile login.svg";
import { Select, Option } from "@material-tailwind/react";
import { signUp } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import { t } from "i18next";
import "./style.scss";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("pharmacy");
  const [selectedCompany, setSelectedCompany] = useState(
    "6686835496a3ac0c3d893d9a"
  );
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
      const data = await signUp(
        email,
        password,
        name,
        selectedRole,
        selectedCompany
      );
      localStorage.setItem("token", data.token);
      toast.success("Account Created Successfully", options);
      localStorage.setItem("companyId", data.results.company);
      localStorage.setItem("id", data.results._id);
      navigate("/SignIn");
    } catch (err) {
      toast.error(err.message, options);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="container p-4 flex items-center justify-center w-full">
        {loading ? (
          <Loader />
        ) : (
          <div className="Wrapper grid grid-cols-1 md:grid-cols-12 gap-8 bg-white shadow-md p-6 rounded-lg overflow-hidden">
            <div className="col-span-1 md:col-span-6 flex items-center justify-center">
              <img
                alt="alamal"
                src={SignUpImg}
                className="mx-auto w-full md:w-auto"
              />
            </div>
            <div className="col-span-1 md:col-span-6 mt-10 sm:mx-auto sm:w-full sm:max-w-sm rounded p-5">
              <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
                {t("signUp")}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="Name"
                    className="block text-sm font-medium leading-6"
                  >
                    {t("userName")}
                  </label>
                  <div className="mt-2">
                    <input
                      id="Name"
                      name="Name"
                      type="text"
                      required
                      autoComplete="name"
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:border-none sm:text-sm sm:leading-6"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                <div className="Selectors flex flex-col gap-3 justify-between">
                  <div className="my-2 flex flex-col w-full">
                    <label
                      htmlFor="role"
                      className="block w-full text-sm font-medium leading-6 mb-2"
                    >
                      Select a Role
                    </label>
                    <Select
                      variant="standard"
                      placeholder="Select a Role"
                      className="select w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                      required
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e)}
                    >
                      <Option value="rep">Medical Rep</Option>
                      <Option value="pharmacy">Pharmacy</Option>
                      <Option value="driver">Driver</Option>
                    </Select>
                  </div>
                  <div className="my-2 flex flex-col w-full">
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium leading-6 mb-2"
                    >
                      Select a Company
                    </label>
                    <Select
                      variant="standard"
                      placeholder="Select a Company"
                      className="select w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                      required
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e)}
                    >
                      <Option value="6686835496a3ac0c3d893d9a">
                        الأمل المتميز
                      </Option>
                      <Option value="6686835d96a3ac0c3d893d9c">
                        المنهل المتميز
                      </Option>
                      <Option value="6686836496a3ac0c3d893d9e">المنهل</Option>
                    </Select>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {t("signUp")}
                  </button>
                </div>
              </form>
              <p className="mt-10 text-center text-sm text-gray-500">
                {t("alreadyHaveAccount")}
                <Link to="/SignIn" className="font-semibold leading-6">
                  {t("login")}
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
