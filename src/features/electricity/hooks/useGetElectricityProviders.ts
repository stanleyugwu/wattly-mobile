import { QueryKeys } from "@/lib/api";
import { useQuery } from "react-query";
import { getElectricityProviders } from "../api";

export const useGetElectricityProviders = () =>
  useQuery({
    queryKey: QueryKeys.getElectricityProviders,
    queryFn: getElectricityProviders,
  });
