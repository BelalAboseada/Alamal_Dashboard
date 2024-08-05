import { t } from "i18next";
import ContentWrapper from "../../components/ContentWrapper/contentWrapper";
import { Input } from "@material-tailwind/react";
import { useState } from "react";
import Button from "../../components/UI/Button";
import { toast } from "react-toastify";
import { addProduct, uploadProductImage } from "../../services/api";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);

  const options = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !name || !price || !desc) {
      toast.error("Data is required!", options);
      return;
    }

    const user = localStorage.getItem("user");
    const companyId = JSON.parse(user).company;
    try {
      const imageUrl = await uploadProductImage(image);
    

      const productData = {
        name,
        desc,
        unitPrice: price,
        pic: imageUrl,
        company: companyId,
      };
      const response = await addProduct(productData, image);
     
      if (response) {
        toast.success("Product created successfully", options);
        clearFormFields();
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error, options);
    }
  };

  const clearFormFields = () => {
    setName("");
    setPrice("");
    setDesc("");
    setImage("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="CreateProduct">
      <ContentWrapper>
        <h1 className="Title">{t("createProduct")}</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-5 rounded-md shadow-sm mb-5"
        >
          <div className="mt-5 space-y-5 md:space-y-0 md:space-x-5 md:flex md:items-center md:justify-between">
            <div className="my-2 mx-3 flex flex-col w-full">
              <label
                htmlFor="Name"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("userName")}
              </label>
              <Input
                variant="standard"
                id="Name"
                placeholder={t("userName")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="Input w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                autoComplete="on"
                autoFocus
              />
            </div>
            <div className="my-2 mx-3 flex flex-col w-full">
              <label
                htmlFor="desc"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("description")}
              </label>
              <Input
                variant="standard"
                id="desc"
                placeholder={t("description")}
                autoComplete="on"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                maxLength={250}
                className="Input w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="mt-5 space-y-5 md:space-y-0 md:space-x-5 md:flex md:items-center md:justify-between">
            <div className="my-2 mx-3 flex flex-col w-full">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("price")}
              </label>
              <Input
                variant="standard"
                id="price"
                placeholder={t("price")}
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="Input w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                autoComplete="on"
              />
            </div>

            <div className="my-2 mx-3 flex flex-col w-full">
              <label
                htmlFor="file"
                className="block text-sm font-medium leading-6 mb-2"
              >
                {t("selectImage")}
              </label>
              <Input
                variant="standard"
                type="file"
                id="file"
                placeholder="Select Image"
                className="Input_file w-full cursor-pointer rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="text-center mt-5">
            <Button type="submit" className="w-64">
              {t("done")}
            </Button>
          </div>
        </form>
      </ContentWrapper>
    </div>
  );
};

export default CreateProduct;
