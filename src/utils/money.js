export const toNumber = (v) => Number(v || 0);

export const formatINR = (v) =>
  `₹${toNumber(v).toLocaleString("en-IN")}`;
