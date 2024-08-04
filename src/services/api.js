import axios from "axios";
import { toast } from "react-toastify";

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

// Update Profile
export const uploadAvatar = async (profilePic) => {
  try {
    const formData = new FormData();
    formData.append("profilePic", profilePic);

    const response = await axios.post(`${ApiUrl}/users/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload Response:", response);

    const image = response.data.profilePic;
    if (!image) {
      throw new Error("Image URL not found in response");
    }
    console.log("image => ", image);
    return image;
  } catch (error) {
    console.log(" err uploading avatar =>  ", error.message);
  }
};

export const updateProfile = async (userId, updatedData) => {
  try {
    let image = "";

    if (updatedData.profilePic) {
      image = await uploadAvatar(updatedData.profilePic);
      console.log("Image URL in updateProfile:", image);
    }

    // Add image URL to updatedData
    const fullUpdatedData = {
      ...updatedData,
      profilePic: image || updatedData.profilePic,
    };

    const response = await axios.put(
      `${ApiUrl}/users/${userId}`,
      fullUpdatedData
    );
    return response.data;
  } catch (error) {
    console.log("err while updating profile =>  ", error.message);
  }
};

// Delete account

export const deleteAccount = async (userId) => {
  try {
    const response = await axios.delete(`${ApiUrl}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.log("err while deleting account =>  ", error.message);
  }
};
//  get uer by Id

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${ApiUrl}/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response? error.response.data : { message: "Network error" };
  }
};

// get All Users
export const getAllUsers = async (page) => {
  try {
    const response = await axios.get(`${ApiUrl}/users?page=${page}`);
    return response.data.results;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
// u
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

    const image = response.data.image;
    if (!image) {
      throw new Error("Image URL not found in response");
    }
    console.log("image => ", image);
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
// Add product Line

export const addProductLine = async (productLineData, invoiceId) => {
  try {
    const response = await axios.post(
      `${ApiUrl}/invoice/product/${invoiceId}`,
      productLineData
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
// delete product line

export const deleteProductLine = async (lineId, invoiceId) => {
  try {
    await axios.delete(`${ApiUrl}/invoice/${invoiceId}/line/${lineId}`);
    const response = await axios.get(`/invoices/${invoiceId}`);
    return response.data.productLines;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// get All Invoices
export const getAllInvoicesUsers = async (page, userId) => {
  try {
    const response = await axios.get(
      `${ApiUrl}/invoice/user/${userId}?page=${page}`
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
// get All Invoices
export const getAllInvoices = async (page) => {
  try {
    const response = await axios.get(`${ApiUrl}/invoice/?page=${page}`);
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
// update invoice

export const updateInvoice = async (invoiceId, updatedInvoiceData) => {
  try {
    const response = await axios.put(
      `${ApiUrl}/invoice/${invoiceId}`,
      updatedInvoiceData
    );
    return response.data;
  } catch (error) {
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
// update Payment

export const updatePayment = async (paymentId, updates) => {
  try {
    const response = await axios.put(`${ApiUrl}/payment/${paymentId}`, updates);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
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
export const uploadProductImage = async (Image) => {
  try {
    const formData = new FormData();
    formData.append("pic", Image);

    const response = await axios.post(`${ApiUrl}/product/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload Response:", response);

    const image = response.data.pic;
    if (!image) {
      throw new Error("Image URL not found in response");
    }
    console.log("image => ", image);
    return image;
  } catch (error) {
    toast.error(error.message);
    console.log(error.message);
  }
};

export const addProduct = async (productData) => {
  try {
    let image = "";

    if (Image) {
      image = await uploadProductImage(Image);
      console.log("Image URL in makeProduct:", image);
    }
    const fullInvoiceData = {
      ...productData,
      image,
    };

    const response = await axios.post(`${ApiUrl}/product`, fullInvoiceData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { message: "Network error" };
  }
};

// update Product

export const updateProduct = async (productId, updatedData) => {
  try {
    let image = updatedData.image;
    if (image) {
      image = await uploadProductImage(image);
      console.log("Image URL in updateProduct:", image);
    }
    const fullInvoiceData = {
      ...updatedData,
      image,
    };
    const response = await axios.put(
      `${ApiUrl}/product/${productId}`,
      fullInvoiceData
    );
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

//  get all visits

export const getAllVisits = async (page) => {
  try {
    const response = await axios.get(`${ApiUrl}/visit?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// get Filtered visits
export const getFilteredVisits = async (filterType, filterValue) => {
  try {
    const response = await axios.get(
      `${ApiUrl}/visit?filterType=${filterType}&filterValue=${filterValue}`
    );
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// makeVisit

export const makeVisit = async (visitData) => {
  try {
    const response = await axios.post(`${ApiUrl}/visit`, visitData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { message: "Network error" };
  }
};

//getAllTrans

export const getAllTransactions = async (page, userId) => {
  try {
    const response = await axios.get(
      `${ApiUrl}/trans/user/${userId}?page=${page}`
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// getFiltered trans

export const getFilteredTransactions = async (filterType, filterValue) => {
  try {
    const response = await axios.get(
      `${ApiUrl}/trans?filterType=${filterType}&filterValue=${filterValue}`
    );
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// makeTrans

export const makeTrans = async (transactionData) => {
  try {
    const response = await axios.post(`${ApiUrl}/trans`, transactionData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { message: "Network error" };
  }
};
// update trans

export const updateTransaction = async (transactionId, updates) => {
  try {
    const response = await axios.put(
      `${ApiUrl}/trans/${transactionId}`,
      updates
    );
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { message: "Network error" };
  }
};
