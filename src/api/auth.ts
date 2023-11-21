import axios from "@/utils/axios";

export const login = (username: string, password: string) => {
  return axios.post("login", { username, password });
};
