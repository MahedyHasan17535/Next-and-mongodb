const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export const toBn = (value: string | number) =>
  String(value).replace(/\d/g, (d) => bnDigits[Number(d)]);

export const parseNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return 0;

  const english = value
    .replace(/[০-৯]/g, (d) => String(bnDigits.indexOf(d)))
    .replace(/[,\s]/g, "")
    .replace(/[^\d.\-]/g, "");

  const num = parseFloat(english);
  return Number.isNaN(num) ? 0 : num;
};

// 1850 -> ১,৮৫০
export const formatPrice = (value: number) => {
  const fixed = Number.isInteger(value) ? value : Number(value.toFixed(1));
  return toBn(fixed.toLocaleString("en-US"));
};

// 2.14 -> ২.১
export const formatPercent = (value: number) =>
  toBn(Math.abs(value).toFixed(1));