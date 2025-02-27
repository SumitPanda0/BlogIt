import axios from "axios";

import { POSTS_URL } from "../constants";

const fetch = () => axios.get(POSTS_URL);

const postsApi = { fetch };

export default postsApi;
