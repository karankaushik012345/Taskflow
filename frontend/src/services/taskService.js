import api from "./api";
export const taskService = {
  getAll:   (params) => api.get("/tasks", { params }),
  getOne:   (id) => api.get("/tasks/" + id),
  create:   (data) => api.post("/tasks", data),
  update:   (id, data) => api.put("/tasks/" + id, data),
  remove:   (id) => api.delete("/tasks/" + id),
  getStats: () => api.get("/tasks/stats"),
};