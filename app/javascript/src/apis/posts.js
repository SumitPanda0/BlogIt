import axios from "axios";

import { POSTS_URL, CREATE_URL, SHOW_URL } from "../constants";

const fetch = (categoryIds = []) => {
  const params =
    categoryIds.length > 0 ? { category_ids: categoryIds.join(",") } : {};

  return axios.get(POSTS_URL, { params });
};

const create = payload => {
  const { title, description, category_ids } = payload;

  return axios.post(CREATE_URL, {
    post: {
      title,
      description,
      category_ids,
    },
  });
};

const show = slug => axios.get(SHOW_URL.replace(":slug", slug));

const postsApi = { create, fetch, show };

export default postsApi;
