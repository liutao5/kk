import axios from "@/utils/axios";

export const getFormula = (pageNum: number = 1, pageSize: number = 1000) => {
  return axios.post(
    `/wms/recipe/list?pageNum=${pageNum}&pageSize=${pageSize}`,
    {}
  );
};

export const addFormula = (name: string, code: string) => {
  return axios.post("/wms/recipe/add", { name, code });
};

export const updateFormula = (id: number, name: string) => {
  return axios.post("/wms/recipe/edit", { id, name });
};

export const removeFormula = (id: number) => {
  return axios.post("/wms/recipe/remove", [id]);
};

export const updateFormulaStatus = (id: number, enable: boolean) => {
  return axios.post("/wms/recipe/edit", { id, enable });
};

export const getMX = (pageNum: number = 1, pageSize: number = 1000) => {
  return axios.post(`/wms/mx/list?pageNum=${pageNum}&pageSize=${pageSize}`, {});
};

export const getNextBatch = () => {
  return axios.post("/wms/mx/get/next/batch", {});
};

export const getNextBLBatch = () => {
  return axios.post("/wms/bl/get/next/batch", {});
};

export const addMX = (mx: any) => {
  return axios.post("/wms/mx/add", mx);
};

export const cancelMX = (mxId: number) => {
  return axios.post("/wms/mx/cancel", { mxId });
};

export const addBL = (creatorName: string, mxIds: number[]) => {
  return axios.post("/wms/mx/create/bl", { creatorName, mxIds });
};

export const getBL = (pageNum: number, pageSize: number) => {
  return axios.post("/wms/bl/list", {});
};

export const getLog = () => {
  return axios.post("/monitor/operlog/list", {});
};

export const getStock = () => {
  return axios.post("/wms/stock/list", {});
};

export const cancelStock = (stockCode: string) => {
  return axios.post("/wms/bl/cancel/shelve", { stockCode });
};

export const getRemoval = () => {
  return axios.post("/wms/order/list", {});
};

export const cancelRemoval = (outOrderId: number) => {
  return axios.post("/wms/order/cancel", { outOrderId });
};
