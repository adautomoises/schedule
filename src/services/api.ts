import Axios from "axios";

const api = Axios.create({
  baseURL: "https://schedule-production-6450.up.railway.app",
});

export default api;
