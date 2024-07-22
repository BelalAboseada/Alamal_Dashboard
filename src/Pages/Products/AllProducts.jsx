import { t } from "i18next";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/api";
import usePagination from "../../hooks/UsePagination";
import Loader from "../../components/Loader/Loader";
import Img from "../../assets/product1.png";
import Pagination from "../../components/Pagination/Pagination";

const AllProducts = () => {
  const [Product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const { page, nextPage, prevPage, goToPage, totalPages, updateTotalPages } =
    usePagination(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllProducts(page);
        setProduct(data.results);
        updateTotalPages(data.count);
        console.log("Fetched Products:", data.results);
        console.log("Total Pages:", totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return (
    <div className="AllProducts">
      <h1 className="Title">{t("products")}</h1>
      <ContentWrapper>
        <div className="Header shadow-md rounded-md p-2 flex justify-between items-center text-right">
          <div className="Breadcrumb">
            <Breadcrumbs>
              <Link
                to={"/"}
                className="opacity-60 text-black text-sm font-medium lg:text-base lg:font-extrabold"
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
                to={"/AllProducts"}
                className="text-sm font-medium lg:text-base lg:font-extrabold"
              >
                <span>{t("products")}</span>
              </Link>
            </Breadcrumbs>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="content mt-5">
            {Product.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                  {Product.map((product) => (
                    <div key={product._id} className="group cursor-pointer">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 xl:aspect-h-8 xl:aspect-w-7">
                        <img
                          src={Img}
                          alt={product.name}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                      <div className="ProductInfo flex justify-between items-center">
                        <h3 className="mt-4 mx-1 text-sm text-gray-700">
                          {product.name}
                        </h3>
                        <p className="mt-4 mx-1 text-lg font-medium">
                          {product.unitPrice}$
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pagination-wrapper py-2 flex justify-center items-center mt-10">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    goToPage={goToPage}
                  />
                </div>
              </>
            ) : (
              <p>{t("No products found")}</p>
            )}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default AllProducts;
