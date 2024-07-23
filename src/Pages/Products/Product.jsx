import { useParams } from "react-router-dom";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import { useEffect, useState } from "react";
import { getProduct } from "../../services/api";
import Loader from "../../components/Loader/Loader";

const Product = () => {
  let { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data.results);
        console.log("Fetched invoice:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="Product" key={id}>
      <ContentWrapper>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : product ? (
          <div className="invoice-details">
            <h1>{product.name}</h1>
            <p>{product.desc}</p>
            <p>Price: {product.unitPrice}</p>
          </div>
        ) : (
          <h1>Product Not Found</h1>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Product;
