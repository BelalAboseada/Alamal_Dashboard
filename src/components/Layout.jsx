import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "../Routes/routes";
import { SidebarWithBurgerMenu } from "./Sidebar/Sidebar";

const Layout = () => {
  return (
    <>
      <SidebarWithBurgerMenu />
      <AppRoutes />
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default Layout;
