import axios from "axios";

const fetch = (search = "") => {
  const params = search ? { search } : {};

  return axios.get("/api/v1/categories", { params });
};

const create = ({ name }) => {
  const payload = { name };

  return axios.post("/api/v1/categories", { category: payload });
};

const show = id => axios.get(`/api/v1/categories/${id}`);

const categoriesApi = { fetch, create, show };

export default categoriesApi;
