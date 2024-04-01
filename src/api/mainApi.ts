import axios from "@/utils/axios";

export const getFormula = (filter?: any) => {
  return axios.post(`/wms/recipe/list`, filter || {});
};

export const addFormula = (name: string, code: string) => {
  return axios.post("/wms/recipe/add", { name, code });
};

export const updateFormula = (id: number, name: string) => {
  return axios.post("/wms/recipe/edit", { id, name });
};

export const removeFormula = (id: string) => {
  return axios.post("/wms/recipe/remove", [id]);
};

export const updateFormulaStatus = (id: number, enable: boolean) => {
  return axios.post("/wms/recipe/edit", { id, enable });
};

export const getMX = (filter?: any) => {
  return axios.post(`/wms/mx/list`, filter || {});
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

export const getBL = (filter?: any) => {
  return axios.post(`/wms/bl/list`, filter || {});
};

export const cancelBL = (blId: number) => {
  return axios.post("/wms/bl/cancel", { blId });
};

export const getLog = (filter?: any) => {
  return axios.post("/monitor/operlog/list", filter || {});
};

export const getStock = (filter?: any) => {
  return axios.post(`/wms/stock/list`, filter || {});
};

export const cancelStock = (stockCode: string) => {
  return axios.post("/wms/bl/cancel/shelve", { stockCode });
};

export const getRemoval = (filter?: any) => {
  return axios.post("/wms/order/list", filter || {});
};

export const cancelRemoval = (outOrderId: number) => {
  return axios.post("/wms/order/cancel", { outOrderId });
};

export const addOrder = (params: any) => {
  return axios.post("/wms/order/add", params);
};

export const getStockNum = () => {
  return axios.post("/wms/stock/recipe/group/list", {});
};

export const getConfig = () => {
  return axios.post("/wms/config/get", {});
};

export const updateConfig = (forceFifo: string) => {
  return axios.post("/wms/config/update", { forceFifo });
};
