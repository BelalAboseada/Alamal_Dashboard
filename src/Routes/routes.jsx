import { Routes, Route, useLocation } from "react-router-dom";
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
import Invoice from "../Pages/Invoices/Invoice";
import PaymentsByInvoice from "../Pages/Payments/PaymentsByInvoice";
import AllProducts from "../Pages/Products/AllProducts";
import Product from "../Pages/Products/Product";
import CreateProduct from "../Pages/Products/CreateProduct";
import MakeVisit from "../Pages/Visits/makeVisit";
import ProtectedRoute from "./ProtectedRoute";
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const canCreateInvoice = user?.role !== "driver" && user?.role !== "rep";
  const canCreateProduct =
    user?.role !== "driver" &&
    user?.role !== "rep" &&
    user?.role !== "pharmacy";
  const canCreateTrans = user?.role !== "accountant";

  return (
    <Routes location={location} key={location.pathname}>
      <Route index element={<Profile />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Profile" element={<Profile />} />
      <Route
        path="/MakeInvoice"
        element={
          <ProtectedRoute
            element={<MakeInvoice />}
            isAllowed={canCreateInvoice}
          />
        }
      />
      <Route path="/AllInvoices" element={<AllInvoices />} />
      <Route path="/Invoice/:id" element={<Invoice />} />
      <Route path="/AllProducts" element={<AllProducts />} />
      <Route path="/Product/:id" element={<Product />} />
      <Route
        path="/MakeProduct"
        element={
          <ProtectedRoute
            element={<CreateProduct />}
            isAllowed={canCreateProduct}
          />
        }
      />
      <Route path="/AllPayments" element={<AllPayments />} />
      <Route path="/MakePayment" element={<MakePayment />} />
      <Route path="/payment/invoice/:id" element={<PaymentsByInvoice />} />
      <Route path="/ArrangeVisits" element={<ArrangeVisits />} />
      <Route path="/makeVisit" element={<MakeVisit />} />
      <Route path="/AllVisits" element={<AllVisits />} />
      <Route path="/AllTransactions" element={<AllTrans />} />
      <Route
        path="/MakeTransactions"
        element={
          <ProtectedRoute
            element={<MakeTransaction />}
            isAllowed={canCreateTrans}
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
