/**
 * Formats given number as NGN currency value
 */
export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    style: "currency",
  }).format(amount || 0);
