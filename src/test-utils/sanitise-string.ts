export const sanitiseString = (text: string = "") =>
  text
    .replace(/\s+/g, " ")
    .replace(/(\u2026|\.{3})/, "…")
    .trim();
