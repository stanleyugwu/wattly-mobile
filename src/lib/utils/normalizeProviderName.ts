/**
 * Returns formatted and normalized product name e.g Enugu Electric from electricity transaction
 */
export const normalizeProvidername = (
  productName: string,
  serviceId: string
) => {
  const formattedProviderName = serviceId
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return productName || formattedProviderName || "Electricity Provider";
};
