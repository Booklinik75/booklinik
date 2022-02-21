export default function formatPrice(price) {
  let reverse = price?.toString()?.split("")?.reverse()?.join(""),
    currency = reverse?.match(/\d{1,3}/g);
  currency = currency?.join(" ")?.split("")?.reverse()?.join("");

  return currency;
}
