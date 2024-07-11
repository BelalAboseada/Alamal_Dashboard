import "./style.scss";

import Lottie from "lottie-react";
import LoadingData from "../../assets/loading.json";

const Loader = () => {
  return <Lottie animationData={LoadingData}  />;
};

export default Loader;
