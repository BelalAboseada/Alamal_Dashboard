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
import ButtonUi from "../../components/UI/Button"
import ContentLoader from "../../components/Loader/ContentLoader";
import { addProductLine, getAllProducts, getInvoice } from "../../services/api";
import Loader from "../../components/Loader/Loader";

const AddProductLine = ({ invoiceId }) => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productLines, setProductLine] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [ProductLoading, setProductLoading] = useState(false);

  const handleOpen = () => setOpen((prevOpen) => !prevOpen);

  useEffect(() => {
    const fetchData = async () => {
      setProductLoading(true);
      try {
        const data = await getAllProducts();
        setProducts(data.results);
        setProductLoading(false);
        console.log("Fetched Products:", data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProductLoading(false);
      }
    };

    fetchData();
  }, []);

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

      const response = await addProductLine(productLineData, invoiceId);
      console.log("Product Line Created Successfully", response);
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
      <ButtonUi onClick={handleOpen} className={`w-48`}>{t("AddPL")}</ButtonUi>
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
                    {t("selactProd")}
                  </label>
                  <Select
                    variant="standard"
                    placeholder={t("selactProd")}
                    id="Product"
                    className="select w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e)}
                    required
                  >
                    {ProductLoading ? (
                      <div className="flex justify-center items-center">
                        <ContentLoader />
                      </div>
                    ) : (
                      products.map((prod) => (
                        <Option key={prod._id} value={prod._id}>
                          {prod.name}
                        </Option>
                      ))
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
