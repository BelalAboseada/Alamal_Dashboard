import { PencilIcon } from "@heroicons/react/24/solid";
import { Card, CardBody, CardFooter, Dialog, Input, Typography,Button } from "@material-tailwind/react";
import { t } from "i18next";
import { useState } from "react";
import { toast } from "react-toastify";
import { updateProduct, uploadProductImage } from "../../services/api";
import ButtonUI from "../../components/UI/Button"

const EditProduct = ({ productId  }) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");

  const handleOpen = () => setOpen((prevOpen) => !prevOpen);

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
    try{
      const updatedData = {name}
     if (image) {
       const uploadedImageUrl = await uploadProductImage(image);
       updatedData.pic = uploadedImageUrl;
     }
     const response = await updateProduct(productId, updatedData);
      toast.success("Product updated successfully", options);
      console.log("Product updated successfully", response);
      window.location.reload();

    }catch(err){
      toast.error("Error updating product!",options );
      console.error("Error updating product!", err);
    }
   
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      console.log("Selected file:", file);
    }
  };

  return (
    <>
      <ButtonUI className="flex items-center text-center" onClick={handleOpen}>
        <span>
          <PencilIcon className="text-white" />
        </span>
        Edit Product
      </ButtonUI>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <form onSubmit={handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" className="title_Update">
                {t("UpdateProduct")}
              </Typography>
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium leading-6"
                >
                  {t("uploadImage")}
                </label>
                <div className="mt-2">
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
              <div>
                <label
                  htmlFor="Name"
                  className="block text-sm font-medium leading-6"
                >
                  {t("userName")}
                </label>
                <div className="mt-2">
                  <Input
                    id="Name"
                    name="Name"
                    variant="static"
                    type="text"
                    autoComplete="name"
                    autoFocus
                    placeholder={name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="Input w-full rounded-md border-0 p-2 shadow-md sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </CardBody>
            <CardFooter className="pt-0 flex items-center gap-2">
              <ButtonUI
                type="submit"
                variant="filled"
                ripple={false}
                className="btn_Update"
                onClick={handleSubmit}
              >
                {t("update")}
              </ButtonUI>
              <Button
                variant="text"
                color="black"
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
    </>
  );
};

export default EditProduct;