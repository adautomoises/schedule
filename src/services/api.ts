import Axios from "axios";

const api = Axios.create({
  baseURL: "https://schedule-production-4ea5.up.railway.app",
});

export default api;
