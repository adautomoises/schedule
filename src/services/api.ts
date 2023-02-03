import Axios from "axios";

const api = Axios.create({
  baseURL: "https://schedule-production-85dc.up.railway.app",
});

export default api;
