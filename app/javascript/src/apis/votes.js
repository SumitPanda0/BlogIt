import axios from "axios";

import { POSTS_URL } from "../constants";

const votesApi = {
  vote: ({ payload }) =>
    axios.post(`${POSTS_URL}/${payload.postSlug}/vote`, {
      vote_type: payload.voteType,
    }),
};

export default votesApi;
