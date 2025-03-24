import axios from "axios";

import { CATEGORIES_URL } from "../constants";

const fetch = (search = "") => {
  const params = search ? { search } : {};

  return axios.get(CATEGORIES_URL, { params });
};

const create = ({ name }) => {
  const payload = { name };

  return axios.post(CATEGORIES_URL, { category: payload });
};

const show = id => axios.get(`${CATEGORIES_URL}/${id}`);

const categoriesApi = { fetch, create, show };

export default categoriesApi;
