import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../Pages/Home/Home";
import SignIn from "../Pages/SignIn/SignIn";
import SignUp from "../Pages/SignUp/signUp";
import PageNotFound from "../Pages/Page404/PageNotFound";
import Profile from "../Pages/Profile/Profile";
import MakeInvoice from "../Pages/Invoices/MakeInvoice";
import AllInvoices from "../Pages/Invoices/AllInvoices";
import AllPayments from "../Pages/Payments/AllPayments";
import MakePayment from "../Pages/Payments/MakePayment";
import ArrangeVisits from "../Pages/Visits/ArrangeVisits";
import AllVisits from "../Pages/Visits/AllVisits";
import AllTrans from "../Pages/transactions/AllTrans";
import MakeTransaction from "../Pages/transactions/MakeTransaction";

const AppRoutes = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route index element={<Profile />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/MakeInvoice" element={<MakeInvoice />} />
      <Route path="/AllInvoices" element={<AllInvoices />} />
      <Route path="/AllPayments" element={<AllPayments />} />
      <Route path="/MakePayment" element={<MakePayment />} />
      <Route path="/ArrangeVisits" element={<ArrangeVisits />} />
      <Route path="/AllVisits" element={<AllVisits />} />
      <Route path="/AllTransactions" element={<AllTrans />} />
      <Route path="/MakeTransactions" element={<MakeTransaction />} />
    </Routes>
  );
};

export default AppRoutes;
