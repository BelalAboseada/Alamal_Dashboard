/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Card,
  CardBody,
  CardFooter,
  Dialog,
  Input,
  Option,
  Select,
  Typography,
  Button,
} from "@material-tailwind/react";
import ButtonUI from "../../components/UI/Button";
import { t } from "i18next";
import { useEffect, useState } from "react";
import ContentLoader from "../../components/Loader/ContentLoader";
import { addProductLine, getAllProducts, getInvoice } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { useSelector } from "react-redux";

const AddProductLine = ({ invoiceId }) => {
  const user = useSelector((state) => state.user.user);
  const companyId = user.company;
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productLines, setProductLine] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [productLoading, setProductLoading] = useState(false);

  const handleOpen = () => setOpen((prevOpen) => !prevOpen);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setProductLoading(true);
      let allProducts = [];
      let page = 1;
      let hasMore = true;

      try {
        while (hasMore) {
          const data = await getAllProducts(page, companyId);

          if (data && data.results) {
            allProducts = [...allProducts, ...data.results];
            hasMore = data.results.length > 0;
            page += 1;
          } else {
            hasMore = false;
          }
        }
        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setProductLoading(false);
      }
    };

    fetchAllProducts();
  }, [companyId]);

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productLineData = {
        productLines: [
          {
            product: selectedProductId,
            qty: quantity,
          },
        ],
      };
      await addProductLine(productLineData, invoiceId);
      setLoading(true);

      const updatedInvoice = await getInvoice(invoiceId);
      setProductLine(updatedInvoice.productLines);
      setOpen(false);
      setSelectedProductId("");
      setQuantity(0);
      window.location.reload();
    } catch (err) {
      console.log("Error while creating Product Line:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ButtonUI onClick={handleOpen} className={`w-full`}>
        {t("AddPL")}
      </ButtonUI>
      {loading ? (
        <Loader />
      ) : (
        <Dialog size="xs" open={open} className="bg-transparent shadow-none">
          <Card className="mx-auto w-full max-w-[24rem]">
            <form onSubmit={handleSubmit}>
              <CardBody className="flex flex-col gap-4">
                <Typography variant="h4" className="title_Update">
                  {t("AddPL")}
                </Typography>
                <div className="my-2 mx-3 flex flex-col w-full">
                  <label
                    htmlFor="Product"
                    className="block text-sm font-medium leading-6 mb-2"
                  >
                    {t("selectProd")}
                  </label>
                  <Select
                    variant="standard"
                    placeholder={t("selectProd")}
                    id="Product"
                    className="select w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e)}
                    required
                  >
                    {productLoading ? (
                      <div className="flex justify-center items-center">
                        <ContentLoader />
                      </div>
                    ) : products.length > 0 ? (
                      products.map((prod) => (
                        <Option key={prod._id} value={prod._id}>
                          {prod.name}
                        </Option>
                      ))
                    ) : (
                      <Typography>{t("noProducts")}</Typography>
                    )}
                  </Select>
                </div>
                <div className="my-2 mx-3 flex flex-col w-full">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium leading-6 mb-2"
                  >
                    {t("quantity")}
                  </label>
                  <Input
                    variant="standard"
                    id="quantity"
                    placeholder={t("quantity")}
                    value={quantity}
                    type="number"
                    min="0"
                    required
                    onChange={handleQuantityChange}
                    className="Input w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                  />
                </div>
              </CardBody>
              <CardFooter className="pt-0 flex items-center gap-2">
                <ButtonUI
                  type="submit"
                  variant="filled"
                  ripple={false}
                  className="btn_Update"
                  disabled={!selectedProductId || quantity <= 0}
                >
                  {t("create")}
                </ButtonUI>
                <Button
                  variant="text"
                  onClick={handleOpen}
                  ripple={false}
                  className="hover:bg-transparent"
                >
                  {t("cancel")}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </Dialog>
      )}
    </>
  );
};

export default AddProductLine;
