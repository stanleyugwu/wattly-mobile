import { ElectricityProviders as Provider } from "@/features/electricity/types";
import { Images, RemoteImages } from "@assets/index";

const providerToLogo = {
  [Provider.EEDC]: RemoteImages.eedcLogo,
  [Provider.AEDC]: RemoteImages.aedcLogo,
  [Provider.EKEDC]: RemoteImages.ekedc,
  [Provider.IBEDC]: RemoteImages.ibedc,
  [Provider.IKEDC]: RemoteImages.ikedc,
  [Provider.JED]: RemoteImages.jedc,
  [Provider.KAEDCO]: RemoteImages.kaedco,
  [Provider.KEDCO]: RemoteImages.kedco,
  [Provider.PHED]: RemoteImages.phed,
  [Provider.BEDC]: RemoteImages.bedc,
  // Fuzzy mapping btw known service id to appropriate logo
  "enugu-electric": RemoteImages.eedcLogo,
  "ikeja-electric": RemoteImages.ikedc,
  "ibadan-electric": RemoteImages.ibedc,
  "kano-electric": RemoteImages.kedco,
  "kaduna-electric": RemoteImages.kaedco,
  "eko-electric": RemoteImages.ekedc,
  "portharcourt-electric": RemoteImages.phed,
  "jos-electric": RemoteImages.jedc,
  "benue-electric": RemoteImages.bedc,
  "abuja-electric": RemoteImages.aedcLogo,
  "benin-electric": RemoteImages.bedc,
};

/**
 * Parses the given text for any of the electricity provider's
 * name and return a matching logo url for the provider.
 * // TODO: deprecate
 */
export const getElectricityProviderLogoFromText = (searchTxt: string) => {
  // E.g product name: "Ikeja Electric Payment - IKEDC"
  const providerName = searchTxt || "";

  // Try to extract provider abbreviation E.g "IKEDC"
  const providerAbbrv =
    providerName.split("-")[1]?.trim() ||
    (providerName.match(/\b[A-Z]{3,}\b/)?.[0] as Provider);

  return providerToLogo[providerAbbrv as Provider] ?? Images.iconSmall;
};

export const getElectricityProviderLogoFromServiceId = (serviceId: string) => {
  return (
    providerToLogo[serviceId?.toLowerCase() as Provider] ?? Images.iconSmall
  );
};
