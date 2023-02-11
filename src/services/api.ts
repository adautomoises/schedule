import Axios from "axios";

const api = Axios.create({
  baseURL: "https://schedule-production-1621.up.railway.app",
});

export default api;
