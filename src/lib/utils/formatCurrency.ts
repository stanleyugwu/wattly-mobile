/**
 * Formats given number as NGN currency value
 */
export const formatCurrency = (
  amount: number,
  options?: Intl.NumberFormatOptions
) =>
  new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    style: "currency",
    ...options,
  }).format(amount || 0);
