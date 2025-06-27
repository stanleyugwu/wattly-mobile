import { apiClient } from "@/lib/api";
import { APIResponse } from "@/types";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  ElectricityTopupReqPayload,
  GetMeterInfoReqPayload,
  IElectricityTopupResData,
  IElectricityTx,
  IMeterInfo,
} from "./types";

export const getElectricityTxs = async (): Promise<IElectricityTx[]> => {
  const { data: res } = await apiClient.get<APIResponse<IElectricityTx[]>>(
    "/electricities"
  );
  return res.data;
};

export const getMeterInfo = async (
  data: GetMeterInfoReqPayload,
  config?: AxiosRequestConfig<GetMeterInfoReqPayload>
): Promise<IMeterInfo> => {
  const { data: res } = await apiClient.post<
    any,
    AxiosResponse<APIResponse<IMeterInfo>>,
    GetMeterInfoReqPayload
  >("/electricity_verify", data, config);
  return res.data;
};

export const topUpElectricity = async (
  data: ElectricityTopupReqPayload,
  config?: AxiosRequestConfig<ElectricityTopupReqPayload>
): Promise<IElectricityTopupResData> => {
  console.log(data);
  const { data: res } = await apiClient.post<
    any,
    AxiosResponse<APIResponse<IElectricityTopupResData>>,
    ElectricityTopupReqPayload
  >("/electricity_pay", data, config);
  return res.data;
};
