import axios from "axios";

import { ORGANIZATIONS_URL } from "../constants";

const fetch = () => axios.get(ORGANIZATIONS_URL);

const organizationsApi = {
  fetch,
};

export default organizationsApi;
