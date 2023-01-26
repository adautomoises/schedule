import Axios from "axios";

const api = Axios.create({
  baseURL: "https://schedule-production-42c2.up.railway.app",
});

export default api;
