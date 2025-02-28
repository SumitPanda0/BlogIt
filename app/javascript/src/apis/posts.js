import axios from "axios";

import { POSTS_URL } from "../constants";

const fetch = () => axios.get(POSTS_URL);

const create = payload =>
  axios.post("/api/v1/posts", {
    post: payload,
  });

const postsApi = { create, fetch };

export default postsApi;
