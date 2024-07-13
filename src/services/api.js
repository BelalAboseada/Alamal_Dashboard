import axios from "axios";

// Api url
const ApiUrl = "http://194.164.72.211:8000";

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
// makeInvoice
export const makeInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(`${ApiUrl}/invoice`, invoiceData);
    return response.data;
  } catch (error) {
    throw error.response? error.response.data : { message: "Network error" };
  }
};
export const InvoiceImage = async (invoiceImage) => {
  try {
    const formData = new FormData();
    formData.append("image", invoiceImage);

    const response = await axios.post(`${ApiUrl}/invoice/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
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
// get All Invoices

export const getAllInvoices = async (page, limit) => {
  try {
     const response = await axios.get(
       `${ApiUrl}/invoice?page=${page}&limit=${limit}`
     );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

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
      `${ApiUrl}/invoice?filterType=${filterType}&filterValue=${filterValue}`,
      {
        params: { filterType, filterValue },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};