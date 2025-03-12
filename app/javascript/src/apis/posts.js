import axios from "axios";

import { POSTS_URL, CREATE_URL, SHOW_URL, UPDATE_URL } from "../constants";

const fetch = (categoryIds = []) => {
  const params =
    categoryIds.length > 0 ? { category_ids: categoryIds.join(",") } : {};

  return axios.get(POSTS_URL, { params });
};

const create = payload => {
  const { title, description, category_ids, status } = payload;

  return axios.post(CREATE_URL, {
    post: {
      title,
      description,
      category_ids,
      status,
    },
  });
};

const show = slug => axios.get(SHOW_URL.replace(":slug", slug));

const update = payload => {
  const { slug, title, description, category_ids, status } = payload;

  return axios.put(UPDATE_URL.replace(":slug", slug), {
    post: {
      title,
      description,
      category_ids,
      status,
    },
  });
};

const destroy = (slug, quiet) =>
  axios.delete(UPDATE_URL.replace(":slug", slug), {
    params: { quiet },
  });

const fetchUserPosts = () => axios.get(`${POSTS_URL}/user_posts`);

const postsApi = { create, destroy, fetch, show, update, fetchUserPosts };

export default postsApi;
