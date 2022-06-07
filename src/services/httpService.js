import axios from "axios";

axios.interceptors.response.use(null, (error) => {
  if (error.response) {
    // const status = error.response.status;
    // const expectedError = error.response && status >= 400 && status < 500;
  }
  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
