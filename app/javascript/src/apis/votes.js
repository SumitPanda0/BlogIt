import axios from "axios";

const votesApi = {
  vote: ({ payload }) =>
    axios.post(`/api/v1/posts/${payload.postSlug}/vote`, {
      vote_type: payload.voteType,
    }),
};

export default votesApi;
