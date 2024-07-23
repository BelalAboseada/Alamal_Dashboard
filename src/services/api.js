import axios from "axios";

// Api url
const ApiUrl = "http://194.164.72.211:8008";

// auth
export const signIn = async (email, password) => {
  try {
    const response = await axios.post(`${ApiUrl}/auth/signin`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
export const signUp = async (
  email,
  password,
  name,
  selectedRole,
  selectedCompany
) => {
  try {
    const response = await axios.post(`${ApiUrl}/auth/signup`, {
      email,
      password,
      name,
      role: selectedRole,
      company: selectedCompany,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// get All Users
export const getDrivers = async () => {
  try {
    const response = await axios.get(`${ApiUrl}/users`);
    return response.data.results.filter((user) => user.role === "driver");
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
export const getPharmacies = async () => {
  try {
    const response = await axios.get(`${ApiUrl}/users`);
    return response.data.results.filter((user) => user.role === "pharmacy");
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
export const getReps = async () => {
  try {
    const response = await axios.get(`${ApiUrl}/users`);
    return response.data.results.filter((user) => user.role === "rep");
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
// Make Invoice
export const uploadInvoiceImage = async (invoiceImage) => {
  try {
    const formData = new FormData();
    formData.append("image", invoiceImage);

    const response = await axios.post(`${ApiUrl}/invoice/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload Response:", response);

    const image = response.data.image[0];
    if (!image) {
      throw new Error("Image URL not found in response");
    }

    return image;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
export const makeInvoice = async (invoiceData, Image) => {
  try {
    let image = "";

    if (Image) {
      image = await uploadInvoiceImage(Image);
      console.log("Image URL in makeInvoice:", image);
    }
    // Add imageUrl to invoiceData
    const fullInvoiceData = {
      ...invoiceData,
      image,
    };
    console.log(fullInvoiceData);

    const response = await axios.post(`${ApiUrl}/invoice`, fullInvoiceData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// get All Invoices
export const getAllInvoices = async (page) => {
  try {
    const response = await axios.get(`${ApiUrl}/invoice?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
// get invoice
export const getInvoice = async (id) => {
  try {
    const response = await axios.get(`${ApiUrl}/invoice/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
// get Filtered Invoices
export const getFilteredInvoices = async (filterType, filterValue) => {
  try {
    const response = await axios.get(
      `${ApiUrl}/invoice?filterType=${filterType}&filterValue=${filterValue}`
    );
    console.log("Response:", response);

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Make Payment
export const CreatePayment = async (paymentData) => {
  try {
    const response = await axios.post(`${ApiUrl}/payment`, paymentData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { message: "Network error" };
  }
};

// All Payments
export const getAllPayments = async (page) => {
  try {
    const response = await axios.get(`${ApiUrl}/payment?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
// get Filtered Payment
export const getFilteredPayments = async (filterType, filterValue) => {
  try {
    const response = await axios.get(
      `${ApiUrl}/payment?filterType=${filterType}&filterValue=${filterValue}`
    );
    console.log("Response:", response);

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
export const getFilteredPaymentsByInvoice = async (
  filterType,
  filterValue,
  id
) => {
  try {
    const response = await axios.get(
      `${ApiUrl}/payment/invoice/${id}?filterType=${filterType}&filterValue=${filterValue}`
    );
    console.log("Response:", response);

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// getPaymentsByInvoice
export const getPaymentsByInvoice = async (id) => {
  try {
    const response = await axios.get(`${ApiUrl}/payment/invoice/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// get ALl Products
export const getAllProducts = async (page) => {
  try {
    const response = await axios.get(`${ApiUrl}/product?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// get filtered products
export const getFilteredProducts = async (filterType, filterValue) => {
  try {
    const response = await axios.get(
      `${ApiUrl}/product?filterType=${filterType}&filterValue=${filterValue}`
    );
    console.log("Response:", response);

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Add product
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${ApiUrl}/product`, productData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { message: "Network error" };
  }
};

// get Product

export const getProduct = async (id) => {
  try {
    const response = await axios.get(`${ApiUrl}/product/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};