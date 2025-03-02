import axios from "axios";

import { POSTS_URL, CREATE_URL, SHOW_URL } from "../constants";

const fetch = () => axios.get(POSTS_URL);

const create = payload =>
  axios.post(CREATE_URL, {
    post: payload,
  });

const show = slug => axios.get(SHOW_URL.replace(":slug", slug));

const postsApi = { create, fetch, show };

export default postsApi;
