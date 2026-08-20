export const CURRENCY_CODE = "KRW";

const krwNumberFormatter = new Intl.NumberFormat("ko-KR", {
  maximumFractionDigits: 0,
});

export function formatKrw(value: number): string {
  return `${krwNumberFormatter.format(value)} ${CURRENCY_CODE}`;
}
