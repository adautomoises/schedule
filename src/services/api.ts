import Axios from "axios";

const api = Axios.create({
  baseURL: "https://schedule-production-e3fc.up.railway.app",
});

export default api;
