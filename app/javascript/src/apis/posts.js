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

const update = (slug, payload) =>
  axios.put(UPDATE_URL.replace(":slug", slug), payload);

const destroy = (slug, quiet) =>
  axios.delete(UPDATE_URL.replace(":slug", slug), {
    params: { quiet },
  });

const fetchUserPosts = (filters = {}) =>
  axios.get(`${POSTS_URL}/user_posts`, {
    params: {
      filter: {
        title: filters.title || "",
        category: filters.category || "",
        status: filters.status || "",
      },
    },
  });

const bulkUpdateStatus = ({ post_ids, status }) =>
  axios.post(`${POSTS_URL}/bulk_update`, { post_ids, status });

const bulkDestroy = ({ post_ids }) =>
  axios.post(`${POSTS_URL}/bulk_destroy`, { post_ids });

const generatePdf = postId => axios.post(`${POSTS_URL}/report`, { postId });

const download = postId =>
  axios.get(`${POSTS_URL}/report/download`, {
    responseType: "blob",
    params: { postId },
  });

const postsApi = {
  fetch,
  show,
  create,
  update,
  destroy,
  fetchUserPosts,
  bulkUpdateStatus,
  bulkDestroy,
  generatePdf,
  download,
};

export default postsApi;
