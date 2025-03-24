import axios from "axios";

import { SESSIONS_URL, USERS_URL } from "../constants";

const login = payload =>
  axios.post(SESSIONS_URL, {
    login: payload,
  });

const signup = payload =>
  axios.post(USERS_URL, {
    user: payload,
  });

const logout = () => axios.delete(SESSIONS_URL);

const authApi = {
  login,
  signup,
  logout,
};

export default authApi;
