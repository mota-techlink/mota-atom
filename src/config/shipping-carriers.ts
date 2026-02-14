/**
 * Shipping carrier definitions shared across admin and dashboard UIs.
 * Values must match the `shipping_carrier` enum in the database.
 */
export const SHIPPING_CARRIERS = [
  { value: "no_shipping", label: "No Shipping Required" },
  { value: "fedex", label: "FedEx" },
  { value: "ups", label: "UPS" },
  { value: "dhl", label: "DHL" },
  { value: "dhl_express", label: "DHL Express" },
  { value: "usps", label: "USPS" },
  { value: "royal_mail", label: "Royal Mail" },
  { value: "canada_post", label: "Canada Post" },
  { value: "australia_post", label: "Australia Post" },
  { value: "la_poste", label: "La Poste" },
  { value: "hermes", label: "Hermes" },
  { value: "sf_express", label: "SF Express" },
  { value: "yunexpress", label: "YunExpress" },
  { value: "yunda", label: "Yunda" },
  { value: "china_post", label: "China Post" },
  { value: "hk_post", label: "Hong Kong Post" },
  { value: "japan_post", label: "Japan Post" },
  { value: "aramex", label: "Aramex" },
  { value: "tnt", label: "TNT" },
  { value: "gls", label: "GLS" },
] as const;

export type ShippingCarrierValue = (typeof SHIPPING_CARRIERS)[number]["value"];

/**
 * Get user-friendly label for a carrier value.
 */
export function getCarrierLabel(value: string | undefined | null): string {
  if (!value || value === "no_shipping") return "No Shipping Required";
  return (
    SHIPPING_CARRIERS.find((c) => c.value === value)?.label ??
    value.replace(/_/g, " ")
  );
}
