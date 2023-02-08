import Axios from "axios";

const api = Axios.create({
  baseURL: "https://schedule-production-2627.up.railway.app",
});

export default api;
