import { RemoteImages } from "@assets/index";
import { ElectricityProvider } from "./types";

// TODO: remove
export const PROVIDERS: ElectricityProvider[] = [
  {
    logo: RemoteImages.eedcLogo,
    name: "EEDC Enugu Electricity Distribution Company",
    serviceId: "eedc-electric",
  },
  {
    logo: RemoteImages.aedcLogo,
    name: "AEDC Abuja Electricity Distribution Company",
    serviceId: "aedc-electric",
  },
  {
    logo: RemoteImages.ikedc,
    name: "IKEDC Ikeja Electricity Distribution Company",
    serviceId: "ikeja-electric",
  },
];
