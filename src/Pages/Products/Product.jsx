import { Link, useParams } from "react-router-dom";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import { useEffect, useState } from "react";
import { getProduct } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { t } from "i18next";
import { Breadcrumbs } from "@material-tailwind/react";
import "./style.scss";
// import Button from "../../components/UI/Button";
import EditProduct from "./editProduct";

const Product = () => {
  let { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);
    const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data.results);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const openImageModal = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const closeImageModal = () => {
    setEnlargedImage(null);
  };
  return (
    <div className="Product" key={id}>
      <ContentWrapper>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : product ? (
          <div className="product_details">
            <h1 className="Title">{t("productDetails")}</h1>
            <div className="Header shadow-md rounded-md p-2 flex justify-between items-center text-right">
              <div className="Breadcrumb">
                <Breadcrumbs>
                  <Link
                    to="/"
                    className="opacity-60 text-black text-sm font-medium  lg:text-base lg:font-normal "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </Link>
                  <Link
                    to="/ALlProducts"
                    className="text-sm font-medium  lg:text-base lg:font-normal  "
                  >
                    <span>{t("products")}</span>
                  </Link>

                  <Link
                    to={`/product/${id}`}
                    className="text-sm font-medium  lg:text-base lg:font-normal  "
                  >
                    <span>{t("productDetails")}</span>
                  </Link>
                </Breadcrumbs>
              </div>
            </div>
            <div className="content grid grid-cols-12 gap-5 mt-5">
              <div className="col-span-12 md:col-span-6 lg:col-span-4 flex items-center justify-center">
                <div className="InvoiceImg">
                  <img
                    alt="product Image "
                    className="rounded-md m-3 shadow-lg bg-cover clickable-image"
                    src={product.pic}
                    width={280}
                    height={280}
                    onClick={() => openImageModal(product.pic)}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-8 flex   flex-col items-center text-right  md:items-start  mt-6">
                <div className="name flex mb-6 w-96">
                  <h5 className="font-bold  text-2xl flex">{product.name}</h5>
                </div>
                <div className="description flex gap-1  mb-6">
                  <p className="font-bold text-base mx-1">
                    {t("description")} 
                  </p>
                  <p className="font-normal text-base text-black">
                    {product.desc}
                  </p>
                </div>
                <div className="date flex gap-1  py-1  ">
                  <p className="font-bold text-base mx-1">
                    <strong>{t("createdAt")}:</strong>
                  </p>
                  <p className="font-normal text-base text-black">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="description mb-6"></div>

                <div className="unitPrice">
                  <p className="font-medium  text-2xl   ">
                    {product.unitPrice}$
                  </p>
                </div>
                <div className="Button_Wrapper">
                  <EditProduct product={product} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <p>{t("productNotFound")}</p>
          </div>
        )}

        {enlargedImage && (
          <div className="modal-overlay" onClick={closeImageModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <span className="close  text-Black " onClick={closeImageModal}>
                &times;
              </span>
              <img
                className="enlarged-image"
                src={enlargedImage}
                alt="enlarged-invoice"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Product;
