import axios from "axios";

const api = axios.create({
  baseURL: "https://api.aquagas.example", // Replace with real backend
  headers: { "Content-Type": "application/json" },
});

export const fetchVendors = async () => {
  const res = await api.get("/vendors");
  return res.data;
};

export const fetchVendorProducts = async (vendorId: string) => {
  const res = await api.get(`/vendors/${vendorId}/products`);
  return res.data;
};
