import "./style.scss"
import Img404 from "../../assets/Erorr404.svg"
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";
const PageNotFound = () => {
  return (
    <div className="PageNotFound mt-32 flex items-center flex-col justify-center">
      <img src={Img404} alt="Image 404" className="w-auto h-96" />
      <h2 className="text-black  font-bold">Something went wrong.</h2>
      <h6 className="my-2 text-black font-normal" >Sorry, We can’t find the page you’re looking for.</h6>
    <Link to={"/"}>
    <Button >
        Go back
    </Button>
    </Link>
    </div>
  );
}

export default PageNotFound